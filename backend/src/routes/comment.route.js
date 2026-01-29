import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  addComment,
  getBlogComments,
  updateComment,
  deleteComment
} from "../controllers/comment.controller.js";

const router = Router();

router.get("/blog/:blogId", getBlogComments);
router.post("/blog/:blogId", authMiddleware, addComment);
router.patch("/:commentId", authMiddleware, updateComment);
router.delete("/:commentId", authMiddleware, deleteComment);

export default router;