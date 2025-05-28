import express from "express";
import multer from "multer";
import { checkAuth, login, logout, signup, updateProfilePic } from "../controllers/authController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage});

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/updateProfilePic", protectRoute, upload.single('profilePic'), updateProfilePic);
router.get("/check", protectRoute, checkAuth)

export default router;