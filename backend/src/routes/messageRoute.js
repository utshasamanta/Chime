import express from "express";
import { getMessages, getUserForSidebar, sendMessage } from "../controllers/messageController.js";
import { protectRoute } from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router()
const storage = multer.memoryStorage();
const upload = multer({ storage: storage});

router.get("/users", protectRoute, getUserForSidebar);
router.get("/:receiverId", protectRoute, getMessages);
router.post("/send/:receiverId", protectRoute, upload.single('messageMedia'), sendMessage);

export default router;