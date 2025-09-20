import express from "express";
import {signup,login,logout,checkAuth } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { forgotPassword, resetPassword } from "../controllers/auth.controller.js";
;


const router = express.Router();


router.get("/check-auth", verifyToken, checkAuth);

router.post("/signup", signup);
router.post("/login", login); 
router.post("/logout", logout); 
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);





export default router;






