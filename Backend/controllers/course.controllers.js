import { Course } from "../models/course.model.js";
import { v2 as cloudinary } from 'cloudinary';
import { Purchase } from "../models/purchase.model.js";

export const creataeCourse = async (req, res) => {
   
    // const title = req.body.title;
    // const description = req.body.description;
    // const price = req.body.price;
    // const image = req.body.image;

    // here are destructuaring

    const adminId = req.adminId;

    const {title, description, price, } = req.body;


    try{
        if(!title || !description || !price){
            return res.status(400).json({
               message: "All fields are required"
            })
        }
        const {image} = req.files
        if (!req.files || Object.keys(req.files).length===0) {
            return res.status(400).json({error: "No file uploaded"});
        }
        const allowedFormat = ["image/png","image/jpeg"]
        if (!allowedFormat.includes(image.mimetype)) {
            return res.status(400).json({
                error : "Invalid file format Only PNG and JPG are allowed"
            })
        }

        // cloudanary code

        const cloudResponse = await cloudinary.uploader.upload(image.tempFilePath)
        if (!cloudResponse|| cloudResponse.error) {
            return res.status(400).json({
                error : "Error uploading file to cloudanary"
            })
        }
        const courseData = {
            title,
            description,
            price,
            image:{
                public_id : cloudResponse.public_id,
                url: cloudResponse.url,
            },
            creatorId:adminId
        }
      const course =  await Course.create(courseData)
       res.json({
        message: "Course created successfully",
        course
      })

    }catch(error){
        console.log(error);
        
    }


    
};

export const updateCourse = async(req,res) =>{
    const adminId = req.adminId;
    const {courseId} = req.params;
    const{title, description,price, image} = req.body;

    try {

        const courseSearch = await Course.findById(courseId)
        if (!courseSearch) {
            return res.status(404).json({
                errors: "Cousre not found"
            })
        }
        
        const course = await Course.updateOne({
            _id: courseId,
            creatorId: adminId,
        },{
            title,
            description,
            price,
            image: {
                public_id: image?.public_id ,
                url: image?.url ,
            },
        }
    );

        res.status(201).json({
            message: "Course Updated Successfully",
            course
        })
    } catch (error) {
        res.status(500).json({
            message: "Error in course updating"
        })
        console.log("Error in course updating", error)
    }
}

export const deleteCourse = async(req,res) => {
    const adminId = req.adminId
    const {courseId} = req.params
    try {

        const course = await Course.findOneAndDelete({
            _id:courseId,
            creatorId: adminId,
        })
        console.log("here are course:", course);
        
        if (!course) {
            return res.status(200).json({
                errors: "Course not found!"
            })
        }
        res.status(200).json({
            message:"Course deleted Successfully!"
        })
        
    } catch (error) {
        res.status(500).json({
            errors: "Error in course deleting!"
        })
        console.log("Error in course deleting", error)
    }
}

export const getCourses = async(req,res) => {
    try {
        const courses = await Course.find({})
        res.status(201).json({courses})
    } catch (error) {
        res.status(500).json({
            errors: "Error in getting all courses!"
        })
        console.log("error to get courses", error)
    }
}

export const courseDetails = async (req,res)=>{
    const {courseId} = req.params;
    // console.log(courseId);
    // console.log(req.params);
    try {

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                error: "Course not found"
            })
        }

        res.status(200).json({
            course
        })
        
    } catch (error) {
        res.status(500).json({
            errors: "Error in  getting course details"
        })
        console.log("Error in course details",error)
    }
}


export const buycourses = async (req, res) =>{
    const {userId} = req;
    const {courseId} = req.params;

    try {
        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({
                error: "Course not found!"
            })
        }
        const existingPurchase = await Purchase.findOne({userId,courseId})
        if (existingPurchase) {
            return res.status(400).json({
                error: "User has already purchase this course"
            })
        }

        const newPurchase = new Purchase({userId, courseId})
        await newPurchase.save()
        res.status(201).json({
            message: "Course Purchased successfully !",
            newPurchase
        })
    } catch (error) {
        console.log("error in course buy", error)
        res.status(500).json({
            errors: "Error in course buying"
        })
    }
}