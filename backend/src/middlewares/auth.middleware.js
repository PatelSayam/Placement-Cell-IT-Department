import { Student } from "../models/student.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"




export const verifyJWT = asyncHandler(async (req, _, next) => { // "_" if req,res any of this is unused
    try {
        let token = req.cookies?.accessToken
        if(!token){
            token = req.headers.authorization?.split(" ")[1];
        }
        console.log(token);
        
    
        if(!token){
            throw new ApiError(401,"unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const student = await Student.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!student){
            throw new ApiError(401,"Invalid Access Token")
        }
    
        req.student = student
        next()


    } catch (error) {
        throw new ApiError(401,error.message || "invalid access token message from catch block")
    }
})