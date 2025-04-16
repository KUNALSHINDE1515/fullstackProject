import express from 'express';
import { login, logout, purchases, signup } from '../controllers/user.controller.js';
import userMiddleware from '../middlewares/user.mid.js';


const router = express.Router();
router.post("/singup",signup)
router.post("/login",login)
router.get("/logout",logout)
router.get("/purchases", userMiddleware,purchases)
export default router; // here we are creating a router for the course and exporting it.