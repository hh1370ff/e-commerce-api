import Blog from "../models/blogModel.js";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import HttpError from "../utils/extendedError.js";

// @desc Create new blog
// @route POST /createBlog
// @access Private
export const createBlog = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;

  // Confirm data
  if (!title || !description || !category)
    throw new HttpError("All fields are required", 400);

  if (req.files.length === 0)
    throw new HttpError("Image is required are required", 400);

  const urlsPlusBlur = await Promise.all(
    req.files.map(async (file) => {
      const blurHash = await encodeImageToBlurHash(file, 300, 300);
      const { url } = await cloudinaryUploadImg(file);
      return { url, blurHash };
    })
  );
  // Create and store new blog
  const newBlog = await Blog.create({ ...req.body, images: urlsPlusBlur });
  res.status(201).json({ message: `New newBlog ${newBlog.title} created` });
});

// @desc Update a blog
// @route PATCH /updateBlog
// @access Private
export const updateBlog = asyncHandler(async (req, res) => {
  const { _id, title, description, category } = req.body;

  // Confirm data
  if (!_id || !title || !description || !category)
    throw new HttpError("All fields are required", 400);

  // Does the blog exist to update?
  const blog = await Blog.findById(_id).exec();

  if (!blog) {
    throw new HttpError("Blog not found", 400);
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    blog._id,
    { $set: req.body },
    { new: true }
  );

  res.json(updatedBlog);
});

// @desc Get all blogs
// @route GET /getAllBlogs
// @access public
export const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find().lean();

  // If no blogs
  if (!blogs?.length) {
    throw new HttpError("No blogs found", 400);
  }

  res.json(blogs);
});

// @desc Get a blog
// @route GET /getSingleBlog
// @access public
export const getSingleBlog = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  // Confirm data
  if (!_id) throw new HttpError("ID is required", 400);

  // Get single blog from MongoDB
  let blog = await Blog.findById(_id);

  // If no blog
  if (!blog) {
    throw new HttpError("No blogs found", 400);
  }

  blog = await Blog.populate(blog, { path: "likes dislikes" });

  blog.numViews = blog.numViews + 1;
  blog.save();
  res.json(blog);
});

// @desc Delete a blog
// @route DELETE /deleteBlog
// @access Private
export const deleteBlog = asyncHandler(async (req, res) => {
  const { _id } = req.body;

  // Confirm data
  if (!_id) {
    throw new HttpError("User ID Required", 400);
  }

  // Does the blog exist to delete?
  const blog = await Blog.findById(_id).exec();

  if (!blog) {
    throw new HttpError("Blog not found", 400);
  }

  const result = await blog.deleteOne();

  const reply = `Blog ${result.title} with ID ${result._id} deleted`;

  res.json(reply);
});

// @desc post like blog
// @route POST /hitLike
// @access Private
export const hitLike = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  const { _id: userId } = req.user;

  // Confirm data
  if (!blogId || !userId) {
    throw new HttpError("All fields are required", 400);
  }

  // check user and blog
  const blog = await Blog.findById(blogId);
  const user = await User.findById(userId);
  if (!blog || !user) throw new HttpError("User or Blog does not exist!", 400);

  // check whether user already liked or disliked the blog
  const alreadyDisliked = blog?.dislikes?.find(
    (userId) => userId?.toString() === userId?.toString()
  );
  const alreadyLiked = blog?.likes?.find(
    (userId) => userId?.toString() === userId?.toString()
  );

  //if liked
  if (alreadyLiked) throw new HttpError("You already liked this blog", 409);

  // if disliked
  if (alreadyDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: userId },
        $push: { likes: userId },
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: `blog with id ${blogId} dislike removed and is liked` });
  }

  // if neither like nor disliked
  if (!alreadyLiked && !alreadyDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: userId },
      },
      { new: true }
    );
    return res.status(200).json({ message: `blog with id ${blogId} is liked` });
  }
});

// @desc post dislike blog
// @route POST /hitDislike
// @access Private
export const hitDislike = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  const { _id: userId } = req.user;

  // Confirm data
  if (!blogId || !userId) {
    throw new HttpError("All fields are required", 400);
  }

  // check user and blog
  const blog = await Blog.findById(blogId);
  const user = await User.findById(userId);
  if (!blog || !user) throw new HttpError("User or Blog does not exist!", 400);

  // check whether user already liked or disliked the blog
  const alreadyDisliked = blog?.dislikes?.find(
    (userId) => userId?.toString() === userId?.toString()
  );
  const alreadyLiked = blog?.likes?.find(
    (userId) => userId?.toString() === userId?.toString()
  );

  // if disliked
  if (alreadyDisliked)
    throw new HttpError("You already disliked this blog", 409);

  //if liked
  if (alreadyLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: userId },
        $pull: { likes: userId },
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: `blog with id ${blogId} like removed and is disliked` });
  }

  // if neither like nor disliked
  if (!alreadyLiked && !alreadyDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: userId },
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: `blog with id ${blogId} is disliked` });
  }
});
