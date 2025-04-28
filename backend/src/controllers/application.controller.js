import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { Application } from "../models/application.model.js"
import {Company} from "../models/company.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import mongoose from "mongoose"
import { sendEmail } from "../utils/Nodemailer.js"
import { Student } from "../models/student.model.js"

const applyToJob = asyncHandler(async (req, res) => {

    const { companyId } = req.params;
    
    if(!companyId){
        throw new ApiError(400, "companyId is required")
    }

    const resumeLocalPath = req.files?.resume[0]?.path;

    const resume = await uploadOnCloudinary(resumeLocalPath)

    if (!resume) {
        throw new ApiError(400, "resume file is required")
    }

    const company = await Company.findById(companyId)

    if(!company){
        throw new ApiError(400,"company not found")
    }

    const student = await Student.findById(req.student._id);

    if (!student) {
        return res.status(404).json({ success: false, message: "student not found" });
    }

    const existingApplication = await Application.findOne({
        companyId,
        studentId : req.student._id,
    })

    if(existingApplication){
        throw new ApiError(400,"already applied to this company")
    }

    const newApplication = await Application.create({
        companyId,
        studentId : req.student._id,
        resume:resume.url

    })

    

    // const emailSubject = `Applied to ${job.title}`;
    // const emailText =
    //    ` ${user.username} applied For ${job.title} 
    //    Location : ${job.location} 
    //    Type : ${job.type} 
    //    Overview : ${job.overview} 
    //    Responsibility : ${job.responsiblity} 
    //    Requirment : ${job.requirment} 
    //    SALARY : ${job.salary}`

    // await sendEmail(user.email, emailSubject, emailText);

    //console.log("email sent!");

    res
    .status(200)
    .json(new ApiResponse(200,newApplication,"applied to company successfully"))

})

const getApplicant = asyncHandler(async (req, res) => {

    const { companyId } = req.params;
    
    const studentForCompany = await Application.aggregate([
        {
            $match : { companyId : new mongoose.Types.ObjectId(companyId)}
        },
        {   
            $lookup : {
                from : "students",
                localField : "studentId",
                foreignField : "_id",
                as : "studentDetails"
            },
        },
        {
            $unwind : "$studentDetails"
        },
        {
            $project:{
                _id : 1,
                "studentDetails._id" : 1,
                "studentDetails.fullName" : 1,
                "studentDetails.collegeEmail" : 1,
                "studentDetails.personalEmail" : 1,
                "studentDetails.resume" : 1,
                "status" : 1,
            },
        },
    ])
    

    return res
    .status(200)
    .json(new ApiResponse(200, studentForCompany, "students Retrive Sucessfully"))
})

const getCompany = asyncHandler(async (req, res) => {

    const  studentId  = req.student._id
    
    
    const appliedCompaniesOfStudent = await Application.aggregate([
        {
            $match : { studentId : new mongoose.Types.ObjectId(studentId)}
        },
        {   
            $lookup : {
                from : "companies",
                localField : "companyId",
                foreignField : "_id",
                as : "companyDetails"
            },
        },
        {
            $unwind : "$companyDetails"
        },
        {
            $project:{
                _id : 1,
                "companyDetails._id" : 1,
                "companyDetails.name" : 1,
                "companyDetails.jobRole" : 1,//change what to project as needed 
                "companyDetails.description" : 1,
                "companyDetails.status" :1,
                status:1
            },
        },
    ])

    return res
    .status(200)
    .json(new ApiResponse(200, appliedCompaniesOfStudent, "companies Retrive Sucessfully"))
})


const changeApplicationState = asyncHandler(async(req, res) => {

    const { companyId, studentId } = req.params;
    const { status } = req.body;

    

    // Update the status in the database
    const updatedApplication = await Application.findOneAndUpdate(
        { companyId, studentId }, 
        { $set: { status: status } }, 
        { new: true } 
    );

    const student = await Student.findById(studentId);
    if (!student) {
        return res.status(404).json({ success: false, message: "student not found" });
    }

    // const emailSubject = `Application ${status}`;
    // const emailText =
    //     status === "Accepted"
    //     ? `Congratulations! Your job application has been accepted.`
    //     : `We regret to inform you that your job application has been rejected.`;

    // await sendEmail(user.email, emailSubject, emailText);

    

    if (!updatedApplication) {
        return res.status(404).json(new ApiResponse(404, null, "Application not found"));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedApplication, "Status updated successfully"));
}); // same controller also present in admin controllers file



export {
    getApplicant,
    applyToJob,
    getCompany,
    changeApplicationState
}

