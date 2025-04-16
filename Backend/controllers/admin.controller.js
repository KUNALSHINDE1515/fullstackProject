import { Admin } from "../models/admin.model.js";
import bycrpyt from "bcryptjs"
import {z} from "zod"
import jwt from "jsonwebtoken"
import config from "../routes/config.js";
import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.model.js";
export const signup = async (req,res)=>{
   
    const {firstName, lastName, email, password} = req.body;

    const adminSchema = z.object({
        firstName: z
        .string()
        .min(3,{message: "FristName must be atleast 6 char long"}),
        lastName: z
        .string()
        .min(3,{message: "LastName must be atleast 6 char long"}),
        email: z
        .string()
        .email(),
        password: z
        .string()
        .min(6,{message: "Password must be atleast 6 char long"}),
      });
    const hashPassword = await bycrpyt.hash(password,10)

    const validatedData = adminSchema.safeParse(req.body)
    if (!validatedData.success) {
        return res.status(400).json({errors:validatedData.error.issues.map(err => err.message)})
    }
    
try {
    const existingAdmin = await Admin.findOne({email : email})
    if (existingAdmin) {
        return res.status(400).json({
            errors : "Admin already exists"
        });
    }
    const newAdmin = new Admin({
        firstName,
        lastName,
        email,
        password: hashPassword
    });
    await newAdmin.save();
    res.status(201).json({
        message: "Singup succeedded",
        newAdmin
    })
    
} catch (error) {
    res.status(500).json({
        errors: "errors in signup"
    });
    console.log("error in signup", error)
}


}

export const login = async (req,res) =>{

    const {email, password} = req.body;

    try {
        const Admin = await Admin.findOne({email:email})
        // console.log(Admin)
        const isPasswordCorrect = await bycrpyt.compare(password,Admin.password)

        if (!Admin || !isPasswordCorrect) {
            return res.status(403).json({erros:"Invalid credentials"})
        }

        const token = jwt.sign(
        {
            id: Admin._id,
        },
        config.JWT_ADMIN_PASSWORD,
        {expiresIn: "1d"}
        );
        const cookieOptions = {
            expires : new Date(Date.now() + 24*60 *60 *1000), // 1 day
            httpOnly: true,  // can't be accsed via js directly
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict" // CSRF se hame bachayega
        }
        res.cookie("jwt",token, cookieOptions),
        res.status(201).json({message: "Login successful",Admin,token})
        
    } catch (error) {
        res.status(500).json({
            errors: "Error in login"
        })
        console.log("error in login",error)
    }
}

export const logout = async (req,res) =>{
   

    try {
        res.clearCookie("jwt");
        res.status(200).json({
            message: "Logged Out successfully"
        })
    } catch (error) {
        res.status(500).json({
            errors: "Error in Logout"
        })
        console.log("Error in logout", error);
    }
}