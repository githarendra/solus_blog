import { Comment } from "../models/comment.model.js";
import { Blog } from "../models/blog.model.js";

export const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { blogId } = req.params;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const comment = await Comment.create({
      content,
      author: req.user._id,
      blog: blogId
    });

    res.status(201).json({
      message: "Comment added",
      comment
    });

  } catch (error) {
    console.error("ADD COMMENT ERROR", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.params;

    const comments = await Comment.find({ blog: blogId })
      .populate("author", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({ comments });

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    comment.content = content || comment.content;
    await comment.save();

    res.status(200).json({
      message: "Comment updated",
      comment
    });

  } catch (error) {
    console.error("UPDATE COMMENT ERROR", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await comment.deleteOne();

    res.status(200).json({
      message: "Comment deleted successfully"
    });

  } catch (error) {
    console.error("DELETE COMMENT ERROR", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
