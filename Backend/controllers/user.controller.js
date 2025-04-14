import { User } from "../models/users.models.js";
import bycrpyt from "bcryptjs"
import {z} from "zod"
export const signup = async (req,res)=>{
   
    const {firstName, lastName, email, password} = req.body;

    const usetSchema = z.object({
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

    const validatedData = usetSchema.safeParse(req.body)
    if (!validatedData.success) {
        return res.status(400).json({errors:validatedData.error.issues.map(err => err.message)})
    }
    
try {
    const existingUser = await User.findOne({email : email})
    if (existingUser) {
        return res.status(400).json({
            errors : "User already exists"
        });
    }
    const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashPassword
    });
    await newUser.save();
    res.status(201).json({
        message: "Singup succeedded",
        newUser
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
        const user = User.findOne({email:email})
        const isPasswordCorrect = await bycrpyt.compare(password,user.password)

        if (!user || !isPasswordCorrect) {
            return res.status(403).json({erros:"Invalid credentials"})
        }
        res.status(201).json({message: "Login successful"},user)
        
    } catch (error) {
        res.status(500).json({
            errors: "Error in login"
        })
        console.log("error in login",error)
    }
}