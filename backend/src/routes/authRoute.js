import express from "express";
import multer from "multer";
import { login, logout, signup, updateProfilePic } from "../controllers/authController.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage});

router.post("/signup", signup);
router.get("/login", login);
router.get("/logout", logout);
router.put("/updateProfilePic", upload.single('profilePic'), updateProfilePic);

export default router;