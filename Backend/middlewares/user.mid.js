import jwt from "jsonwebtoken"
import config from "../routes/config.js";


function userMiddleware (req,res,next) {
    const authHeader = req.headers.authorization;
   
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            errors: "No token Provided"
        });
    }
    const token = authHeader.split(" ")[1];

    try {
        const decodeed = jwt.verify(token,config.JWT_USER_PASSWORD)
        req.userId = decodeed.id;
        next();
    } catch (error) {
        console.log("Invalid token or expired token:" +error)
    }
}


export default userMiddleware;