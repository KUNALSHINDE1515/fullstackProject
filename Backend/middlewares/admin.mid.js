import jwt from "jsonwebtoken"
import config from "../routes/config.js";


function adminMiddleware (req,res,next) {
    const authHeader = req.headers.authorization;
   
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            errors: "No token Provided"
        });
    }
    const token = authHeader.split(" ")[1];

    try {
        const decodeed = jwt.verify(token,config.JWT_ADMIN_PASSWORD)
        req.adminId = decodeed.id;
        next();
    } catch (error) {
        console.log("Invalid token or expired token:" +error)
    }
}


export default adminMiddleware;