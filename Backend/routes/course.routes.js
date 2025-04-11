import express from 'express';
import { courseDetails, creataeCourse, deleteCourse, getCourses, updateCourse } from '../controllers/course.controllers.js';

const router = express.Router();

router.post('/create',creataeCourse) // here we are creating a route for the course and using the createCourse function from the controller.
router.put("/update/:courseId",updateCourse)
router.delete("/delete/:courseId",deleteCourse)
router.get("/courses",getCourses)
router.get("/:courseId",courseDetails)
export default router; // here we are creating a router for the course and exporting it.