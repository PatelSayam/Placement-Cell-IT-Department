import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {Student} from "../models/student.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { OTP } from "../models/otp.model.js"
import { AllowedEmail } from "../models/allowedEmails.model.js"
import { sendEmail } from "../utils/Nodemailer.js"
import bcrypt from "bcryptjs"


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
    const { body, files } = req;


    const updateData = {};


    const fields = [
        "collegeEmail", "personalEmail", "rollNo", "collegeId",
        "fullName", "gender", "dob", "contactNumber", "parentContactNumber",
        "parentEmail", "category", "admissionQuota"
    ];

    fields.forEach(field => {
        if (body[field]) updateData[field] = body[field];
    });



    if (body.sscResult || body.sscPassingYear || body.sscBoard || body.sscMarksheetUrl) {
        updateData.ssc = {
            result: body.sscResult,
            passingYear: body.sscPassingYear,
            board: body.sscBoard,
            marksheetUrl: body.sscMarksheetUrl
        };
    }

    if (body.hscResult || body.hscPassingYear || body.hscBoard || body.hscMarksheetUrl) {
        updateData.hsc = {
            result: body.hscResult,
            passingYear: body.hscPassingYear,
            board: body.hscBoard,
            marksheetUrl: body.hscMarksheetUrl
        };
    }

    if (body.diplomaResult || body.diplomaBoardOrUniversity || body.diplomaPassingYear || body.diplomaDegreePdfUrl) {
        updateData.diploma = {
            result: body.diplomaResult,
            boardOrUniversity: body.diplomaBoardOrUniversity,
            passingYear: body.diplomaPassingYear,
            degreePdfUrl: body.diplomaDegreePdfUrl
        };
    }

    if (body.addressLine || body.city || body.pincode) {
        updateData.permanentAddress = {
            addressLine: body.addressLine,
            city: body.city,
            pincode: body.pincode
        };
    }

    if (body.activeBacklogs || body.totalBacklogs) {
        updateData.backlogs = {
            active: body.activeBacklogs,
            total: body.totalBacklogs
        };
    }

    if (body.breakYearsCount || body.breakYearsReason) {
        updateData.breakYears = {
            count: body.breakYearsCount,
            reason: body.breakYearsReason
        };
    }

    if (body.github || body.hackerrank || body.leetcode || body.codechef || body.linkedin) {
        updateData.socialLinks = {
            github: body.github,
            hackerrank: body.hackerrank,
            leetcode: body.leetcode,
            codechef: body.codechef,
            linkedin: body.linkedin
        };
    }


    if (body.skills) {
        updateData.skills = Array.isArray(body.skills) ? body.skills : body.skills.split(",");
    }

    if (body.preferredRoles) {
        updateData.preferredRoles = Array.isArray(body.preferredRoles) ? body.preferredRoles : body.preferredRoles.split(",");
    }

    if (body.certifications) {
        updateData.certifications = Array.isArray(body.certifications) ? body.certifications : body.certifications.split(",");
    }

    if (body.projects) {
        try {
            updateData.projects = JSON.parse(body.projects); 
        } catch (error) {
            throw new ApiError(400, "Invalid projects format. Should be a valid JSON array.");
        }
    }


    if (files?.resume?.[0]?.path) {
        const resumeUpload = await uploadOnCloudinary(files.resume[0].path);
        if (!resumeUpload) {
            throw new ApiError(400, "Resume upload failed");
        }
        updateData.resumeUrl = resumeUpload.url;
    }


    if (files?.profilePhoto?.[0]?.path) {
        const profilePhotoUpload = await uploadOnCloudinary(files.profilePhoto[0].path);
        if (!profilePhotoUpload) {
            throw new ApiError(400, "Profile photo upload failed");
        }
        updateData.profilePhotoUrl = profilePhotoUpload.url;
    }


    const updatedStudent = await Student.findByIdAndUpdate(
        req.student._id,
        { $set: updateData },
        { new: true }
    ).select("-password");

    if (!updatedStudent) {
        throw new ApiError(404, "Student not found");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedStudent, "Student details updated successfully.")
    );
});
  

const viewProfile = asyncHandler(async(req, res) => {

    const {email} = req.body

    if ( !email) {
        throw new ApiError(400, "All fields are required")
    }

    const student = await Student.findOne({
        collegeEmail:email
    })
    console.log("STUDENT", student)

    if(!student){
        throw new ApiError(404,"Student does not exist")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, student, "Student details fetched successfully"))

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

    const { email, password } = req.body;

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

const registerStudentSM = async (req, res) => {
    try {
      const {
        collegeEmail,
        personalEmail,
        password,
        rollNo,
        fullName,
        gender,
        dob,
        contactNumber,
        parentContactNumber,
        parentEmail,
        permanentAddress,
        ssc,
        hsc,
        diploma,
        skills,
        preferredRoles,
        projects,
        certifications,
        socialLinks,
      } = req.body;
  
      const parsedPermanentAddress = permanentAddress ? JSON.parse(permanentAddress) : undefined;
      const parsedSSC = ssc ? JSON.parse(ssc) : undefined;
      const parsedHSC = hsc ? JSON.parse(hsc) : undefined;
      const parsedDiploma = diploma ? JSON.parse(diploma) : undefined;
      const parsedSkills = skills ? JSON.parse(skills) : undefined;
      const parsedPreferredRoles = preferredRoles ? JSON.parse(preferredRoles) : undefined;
      const parsedProjects = projects ? JSON.parse(projects) : undefined;
      const parsedCertifications = certifications ? JSON.parse(certifications) : undefined;
      const parsedSocialLinks = socialLinks ? JSON.parse(socialLinks) : undefined;
  
      if (!collegeEmail || !password || !fullName || !rollNo) {
        return res.status(400).json({ message: "Required fields are missing" });
      }
  
      const existingStudent = await Student.findOne({ collegeEmail });
      if (existingStudent) {
        return res.status(400).json({ message: "Student with this email already registered" });
      }
  
      const otpRecord = await OTP.findOne({ email: collegeEmail, isVerified: true });
      if (!otpRecord) {
        return res.status(400).json({ message: "Please verify your email via OTP first" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const profilePhotoUrl = req.files['profilePhoto'] ? (await uploadOnCloudinary(req.files['profilePhoto'][0].path)).secure_url : '';
      const sscMarksheetUrl = req.files['sscMarksheet'] ? (await uploadOnCloudinary(req.files['sscMarksheet'][0].path)).secure_url : '';
      const hscMarksheetUrl = req.files['hscMarksheet'] ? (await uploadOnCloudinary(req.files['hscMarksheet'][0].path)).secure_url : '';
      const diplomaDegreeUrl = req.files['diplomaDegree'] ? (await uploadOnCloudinary(req.files['diplomaDegree'][0].path)).secure_url : '';
      const resumeUrl = req.files['resume'] ? (await uploadOnCloudinary(req.files['resume'][0].path)).secure_url : '';
  
      const student = await Student.create({
        collegeEmail,
        personalEmail,
        password: hashedPassword,
        rollNo,
        fullName,
        gender,
        dob,
        contactNumber,
        parentContactNumber,
        parentEmail,
        permanentAddress: parsedPermanentAddress,
        ssc: {
          ...parsedSSC,
          marksheetUrl: sscMarksheetUrl,
        },
        hsc: {
          ...parsedHSC,
          marksheetUrl: hscMarksheetUrl,
        },
        diploma: {
          ...parsedDiploma,
          degreePdfUrl: diplomaDegreeUrl,
        },
        skills: parsedSkills,
        preferredRoles: parsedPreferredRoles,
        projects: parsedProjects,
        certifications: parsedCertifications,
        socialLinks: parsedSocialLinks,
        profilePhotoUrl,
        resumeUrl,
        detailsVerified: true,
      });
  
      await OTP.deleteOne({ email: collegeEmail });
  
      return res.status(201).json({
        message: "Student registered successfully",
        student
      });
  
    } catch (error) {
      console.error("Error registering student:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };





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
    registerStudentSM,
}