import express from 'express';
import { login, signup } from '../controllers/user.controller.js';


const router = express.Router();
router.post("/singup",signup)
router.post("/login",login)
export default router; // here we are creating a router for the course and exporting it.