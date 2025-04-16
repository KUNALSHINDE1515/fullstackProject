import express from "express";
import { login, logout, signup } from "../controllers/admin.controller.js";

const router = express.Router()

router.post("/singup",signup)
router.post("/login",login)
router.post("/logout",logout)



export default router