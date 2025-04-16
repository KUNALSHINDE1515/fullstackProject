import express from 'express';
import { buycourses, courseDetails, creataeCourse, deleteCourse, getCourses, updateCourse } from '../controllers/course.controllers.js';
import userMiddleware from '../middlewares/user.mid.js';


const router = express.Router();

router.post('/create',creataeCourse) // here we are creating a route for the course and using the createCourse function from the controller.
router.put("/update/:courseId",updateCourse)
router.delete("/delete/:courseId",deleteCourse)
router.get("/courses",getCourses)
router.get("/:courseId",courseDetails)

router.post("/buy/:courseId",userMiddleware, buycourses)
export default router; // here we are creating a router for the course and exporting it.