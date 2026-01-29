import { Blog } from "../models/blog.model.js";
import { Comment } from "../models/comment.model.js";

const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title or content are required" });
    }

    const blog = await Blog.create({
      title,
      content,
      author: req.user._id
    });

    res.status(201).json({
      message: "Blog created successfully",
      blog
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllBlogs = async (req,res) => {
    try {
        const blogs = await Blog.find()
        .populate("author","username email")
        .sort({createdAt : -1});

        res.status(200).json({blogs});
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}


const getSingleBlog = async (req, res) => {
    try {
        const { blogId } = req.params;

        const blog = await Blog.findById(blogId)
        .populate("author", "username email");

        if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json({ blog });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const getMyBlogs = async (req,res) => {
    try {
        const blogs = await Blog.find({author: req.user._id})
        res.status(200).json({blogs})
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const updateBlog = async (req, res) => {
    try {
        const { blogId } = req.params;
        const { title, content } = req.body;

        if (!title && !content) {
        return res.status(400).json({
            message: "At least one field is required to update"
        });
        }

        const blog = await Blog.findOneAndUpdate(
        { _id: blogId, author: req.user._id },
        { title, content },
        { new: true }
        );

        if (!blog) {
        return res.status(404).json({
            message: "Blog not found or you are not authorized"
        });
        }

        res.status(200).json({
        message: "Blog updated successfully",
        blog
        });

    } catch (error) {
        console.error("UPDATE BLOG ERROR", error);
        res.status(500).json({
        message: "Internal Server Error"
        });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    const blog = await Blog.findOneAndDelete({
      _id: blogId,
      author: req.user._id
    });

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found or unauthorized"
      });
    }

    await Comment.deleteMany({
      blog: blogId
    })

    res.status(200).json({
      message: "Blog deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};


export {
    createBlog,
    updateBlog,
    getAllBlogs,
    deleteBlog,
    getMyBlogs,
    getSingleBlog
}