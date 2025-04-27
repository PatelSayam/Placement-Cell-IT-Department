import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {Student} from "../models/student.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { OTP } from "../models/otp.model.js"
import { AllowedEmail } from "../models/allowedEmails.model.js"
import { sendEmail } from "../utils/Nodemailer.js"


export const generateAccessAndRefreshTokens = async (studentId) => {
    try {
        const student = await Student.findById(studentId)
        const accessToken = student.generateAccessToken()
        const refreshToken = student.generateRefreshToken()

        student.refreshToken = refreshToken
        await student.save({validateBeforeSave:false})

        return {accessToken,refreshToken}


    } catch (error) {
        throw new ApiError(500,error+" : something went wrong while generating Access and Refresh tokens")
    }
} 


const registerStudent = asyncHandler( async (req, res) => {

    const {} = req.body
   
    if(
        [fullname,email,password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400,"all fields are requried")
    }
    
    const existedStudent = await Student.findOne({
        $or: [{email},{fullname}]
    })

    if(existedStudent){
        throw new ApiError(400,"student already exist")
    }
    
    const avatarLocalPath = req.files?.coverimage[0]?.path;

    const coverimage = await uploadOnCloudinary(avatarLocalPath)

    if (!coverimage) {
        throw new ApiError(400, "coverimage file is required")
    }

    const avatarLocalPath1 = req.files?.resume[0]?.path;

    const resume = await uploadOnCloudinary(avatarLocalPath1)
    
    if (!coverimage) {
        throw new ApiError(400, "resume file is required")
    }

    //all other docs from coming from frontend 

   
    const student = await Student.create({
        mockData //all data
    })

    if(!student){
        console.log("failed to register student ");
        
    }
        
    
    const createdStudent = await Student.findById(student._id).select(
            "-password -refreshToken"
    )
    
    if(!createdStudent){
            throw new ApiError(500,"something went wrong while registering student")
    }
    
    return res.status(200).json(
            new ApiResponse(200, createdStudent, "student registerd successfully")
    )

})

const loginStudent = asyncHandler( async(req, res) => {

    const {email, password} = req.body
    

    if(!( email )){
        throw new ApiError(400,"email is requried")
    }

    const student = await Student.findOne(
        {personalEmail:email}
    )

    if(!student){
        throw new ApiError(404,"student does not exist")
    }

    const isPasswordValid = await student.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401,"password incorrect")
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(student._id)

    const loggedInStudent = await Student.findById(student._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }
    
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                student: loggedInStudent, accessToken, refreshToken
            },
            "student logged In successfully"
        )
    )
})


const logoutStudent = asyncHandler(async (req, res) => {

    await Student.findByIdAndUpdate(
        req.student._id,
        {
            $set:{
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(
                200,
                {},
                "student loged out"
            ))
})

const refreshAccessToken = asyncHandler(async(req, res) => {

    const incomingRefreshToken = req.cookies?.refreshToken || req.headers.authorization?.split(" ")[1];

    if(!incomingRefreshToken){
        new ApiError(401,"unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const student = await Student.findById(decodedToken._id)
    
        if(!student){
            new ApiError(401,"Invalid Refresh Token")
        }
    
        if(incomingRefreshToken !== student?.refreshToken){
            new ApiError(401,"Refresh Token is expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(student._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, newRefreshToken},
                "Access Token Refreshed "
            )
        )
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid Refresh Token")
    }
})

const changePassword = asyncHandler(async (req, res) => {

    const student = await Student.findById(req.student._id)

    const { password } = req.body

    student.password = password

    await student.save(
        { validateBeforeSave: false }
    )

    const changedStudent = await Student.findById(req.student._id)

    res
    .status(200)
    .json(new ApiResponse(
        200,
        {
            password
        },
        "password changed"
    ))

})

const getCurrentStudent = asyncHandler(async(req, res) => {
    
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.student,
        "Student fetched successfully"
    ))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const {  } = req.body
  
    
    // if (!fullname || !email) {
    //   throw new ApiError(400, "fullname and email are required")
    // }
  
    // Create an update object with only the fields that are provided
    const updateData = {
      fullname,
      email,
    }
  
    // Add any additional fields that might be in the request
    // This allows for extending the update functionality

    if (req.body.location) updateData.location = req.body.location // example :: in this manner data will be added
                                                                    //to new student obj

    const avatarLocalPath1 = req.files?.resume[0]?.path;

    const resume = await uploadOnCloudinary(avatarLocalPath1)
    
    if (!resume) {
        throw new ApiError(400, "resume file is required")
    }

    updateData.resume = resume.url // update document :: all other in same fashion 
  
    try {
      const student = await Student.findByIdAndUpdate(req.student?._id, { $set: updateData }, { new: true }).select("-password")
  
      if (!student) {
        throw new ApiError(404, "Student not found")
      }
  
      return res.status(200).json(new ApiResponse(200, user, "Account details updated successfully"))

    } catch (error) {

      throw new ApiError(500, error.message || "Failed to update account details")

    }
  })
  

const viewProfile = asyncHandler(async(req, res) => {

    const {email, fullname} = req.body

    if (!fullname || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const student = await Student.findOne({
        $or: [{email},{fullname}]
    })

    if(!student){
        throw new ApiError(404,"Student does not exist")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Student details fetched successfully"))

});

const getAllStudents = asyncHandler(async (req, res) => {
    

        const students = await Student.find().select("-password -refreshToken");

        return res
        .status(200)
        .json( 
            new ApiResponse(
                200, 
                students, 
                "Users retrieved successfully"
            )
        );

});

const sendOtp = asyncHandler(async (req, res) => {

    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const allowed = await AllowedEmail.findOne({ email });
    if (!allowed) {
        throw new ApiError(403, "Email is not allowed to register");
    }

    const existingOtp = await OTP.findOne({ email });

    if (existingOtp) {
        const now = new Date();
        const oneMinuteAgo = new Date(now.getTime() - 1 * 60 * 1000); 

        if (existingOtp.createdAt > oneMinuteAgo) {
            throw new ApiError(429, "OTP already sent recently. Please wait before requesting again.");
        }

        await OTP.deleteOne({ email });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.create({
        email,
        otp,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes expiry
    });

    await sendEmail(
        email,
        "Your OTP Code",
        `Your OTP code is ${otp}. It is valid for 10 minutes.`
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                {}, 
                "OTP sent successfully"
            )
        );
});



const verifyOtp = asyncHandler(async (req, res) => {

    const { email, otp } = req.body;

    if (!email || !otp) {
        throw new ApiError(400, "Email and OTP are required");
    }

    const record = await OTP.findOne({ email, otp });

    if (!record) {
        throw new ApiError(400, "Invalid OTP");
    }

    if (record.expiresAt < new Date()) {
        throw new ApiError(400, "OTP has expired");
    }

    record.isVerified = true;
    await record.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                {}, 
                "OTP verified successfully"
            )
        );
});


const registerWithOtp = asyncHandler(async (req, res) => {

    const { email, password, username } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email, Password and Username are required");
    }

    const otpRecord = await OTP.findOne({ email, isVerified: true });

    if (!otpRecord) {
        throw new ApiError(400, "Please verify your email with OTP first");
    }

    const student = await Student.create({
        personalEmail:email,
        password, 
    });

    if(!student){
        throw new ApiError(400,"student not registed ")
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                201, 
                student, 
                "Student registered successfully"
            )
        );
});





export {
    registerStudent,
    loginStudent,
    logoutStudent,
    refreshAccessToken,
    changePassword,
    getCurrentStudent,
    updateAccountDetails,
    viewProfile,
    getAllStudents,
    sendOtp,
    verifyOtp,
    registerWithOtp,
}