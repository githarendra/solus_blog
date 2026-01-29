import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  createBlog,
  getAllBlogs,
  getMyBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog
} from "../controllers/blog.controller.js";

const router = Router();

router.get("/all", getAllBlogs);
router.get("/user/me", authMiddleware, getMyBlogs);
router.get("/:blogId", getSingleBlog);
router.post("/", authMiddleware, createBlog);
router.patch("/:blogId", authMiddleware, updateBlog);
router.delete("/:blogId", authMiddleware, deleteBlog);


export default router;