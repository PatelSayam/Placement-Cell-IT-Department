import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {Admin} from "../models/admin.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import { Company} from "../models/company.model.js";
import Application from "../models/application.model.js";
import { Student } from "../models/student.model.js"
import mongoose from "mongoose";
import emailQueue from '../utils/emailQueue.js';
import {AllowedEmail} from "../models/allowedEmails.model.js";



const generateAccessAndRefreshTokens =( async (userId) => {
    try {
        const admin = await Admin.findById(userId)
        const accessToken = admin.generateAccessToken()
        const refreshToken = admin.generateRefreshToken()

        admin.refreshToken = refreshToken
        await admin.save({validateBeforeSave:false})

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500,error+" : something went wrong while generating Access and Refresh tokens")
    }
})

const registerAdmin = asyncHandler( async (req, res) => {
    const { email, password } = req.body

    if(
        [email,password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400,"all fields are requried")
    }
    
    const existedAdmin = await Admin.findOne({ email })

    if(existedAdmin){
        throw new ApiError(400,"user already exist")
    }
   
    const admin = await Admin.create({
        email,
        password,
    })

    if(!admin){
        console.log("error while registering admin ");
        
    }
    

    const createdAdmin= await Admin.findById(admin._id).select(
        "-password -refreshToken"
    )

    if(!createdAdmin){
        throw new ApiError(500,"something went wrong while registering user")
    }

    return res.status(200).json(
        new ApiResponse(200, createdAdmin, "admin registerd successfully")
    )
})

const loginAdmin = asyncHandler( async(req, res) => {
    const {email, password} = req.body
    

    if(!(email)){
        throw new ApiError(400,"email is requried")
    }

    const admin = await Admin.findOne({ email })

    if(!admin){
        throw new ApiError(404,"user does not exist")
    }

    const isPasswordValid = await admin.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401,"password incorrect")
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(admin._id)

    const loggedInAdmin = await Admin.findById(admin._id).select("-password -refreshToken")

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
                user: loggedInAdmin, accessToken, refreshToken
            },
            "admin logged In successfully"
        )
    )
})

const logoutAdmin = asyncHandler(async (req, res) => {

    await Admin.findByIdAndUpdate(
        req.admin._id,
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
                "admin loged out"
            ))
})


const listCompanies = asyncHandler(async (req, res) => {
    const companies = await Company.find({});
    return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                companies
            )
        );
  
}) 

const createCompany = asyncHandler(async (req, res) => {
    
      const company = await Company.create({
        ...req.body, // includes name, criteria, deadline, etc.
        customFields: req.body.customFields, // if we go with this approach else not needed
      });

      return res
        .status(201)
        .json(
            new ApiResponse(
                201, company
            )
        );
}) 


const getApplicantsForCompany = asyncHandler(async (req, res) => {

    const { companyId } = req.params;
  
    const applications = await Application.aggregate([
      {
        $match: {
          company: new mongoose.Types.ObjectId(companyId),
        },
      },
      {
        $lookup: {
          from: "students",
          localField: "student",
          foreignField: "_id",
          as: "studentDetails",
        },
      },
      { $unwind: "$studentDetails" },
      {
        $project: {
          _id: 1,
          appliedAt: 1,
          "studentDetails.fullName": 1,
          "studentDetails.email": 1,
          "studentDetails.rollNo": 1,
          "studentDetails.branch": 1,
          "studentDetails.resumeUrl": 1,
        },
      },
    ]);
  
    return res
        .status(200)
        .json(
            new ApiResponse
            (
                200, 
                applications
            )
        );

}) 


const getEligibleStudents = asyncHandler(async (req, res) => {

    //this controller is not needed coz we are not allowing the non eligible student 
    //to apply. handle it on frontend part still for any use we have this api.
    const { companyId } = req.params;
    const company = await Company.findById(companyId);
    
    const eligible = await Student.find({
      sscPercent: { $gte: company.criteria.ssc },
      hscPercent: { $gte: company.criteria.hsc },
      degreeCgpa: { $gte: company.criteria.cgpa },
      backlogs: { $lte: company.criteria.backlogs },
    });
  
    return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                eligible
            )
        );
})

const notifyStudents = asyncHandler(async (req, res) => {

  const { emails, subject, message } = req.body;

  //emails is a array of all the emails.
  //extract all the emails from frontend 
  //so that server dont have any load for file handling.


  if (!emails || !subject || !message) {
    return res.status(400).json(new ApiResponse(400, null, 'Missing required fields.'));
  }


  emails.forEach((email) => {
    emailQueue.add({ to: email, subject, text: message }); 
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200, 
        'Emails queued successfully'
      )
    );
});

const delistCompany =asyncHandler(async (req, res) => {

    const { companyId } = req.params;

    await Company.findByIdAndUpdate(companyId, { isListed: false });

    return res
        .status(200)
        .json(
            new ApiResponse
            (
                200, 
                "Company delisted"
            )
        );
})


const getRealTimeStats = asyncHandler(async (req, res) => {

    const { year, batch } = req.query;
  
    // Get total students in that batch/year
    const totalStudents = await Student.countDocuments({
      admissionYear: year,
      batch: batch,
      role: "student",
    });
  
    // Get all PLACED applications for that year & batch
    const placedApplications = await Application.aggregate([
      {
        $match: {
          status: "PLACED",
          placementYear: parseInt(year),
          batch: batch,
        },
      },
      {
        $group: {
          _id: "$student", // avoid counting same student twice
          company: { $first: "$company" },
          package: { $first: "$package" },
        },
      },
      {
        $lookup: {
          from: "companies",
          localField: "company",
          foreignField: "_id",
          as: "companyDetails",
        },
      },
      {
        $unwind: "$companyDetails",
      },
    ]);
  
    const placedCount = placedApplications.length;
    const totalPackage = placedApplications.reduce((acc, app) => acc + (app.package || 0), 0);
    const highestPackage = placedApplications.reduce((max, app) => Math.max(max, app.package || 0), 0);
    const avgPackage = placedCount > 0 ? totalPackage / placedCount : 0;
  
    // Compute company-wise stats
    const companyStatsMap = {};
    placedApplications.forEach(app => {
      const name = app.companyDetails.name;
  
      if (!companyStatsMap[name]) {
        companyStatsMap[name] = {
          companyId: app.companyDetails._id,
          companyName: name,
          placedCount: 0,
          totalPackage: 0,
        };
      }
  
      companyStatsMap[name].placedCount += 1;
      companyStatsMap[name].totalPackage += app.package || 0;
    });
  
    const companyStats = Object.values(companyStatsMap).map(stat => ({
      ...stat,
      averagePackage: stat.totalPackage / stat.placedCount,
      placementPercentage: ((stat.placedCount / totalStudents) * 100).toFixed(2),
    }));
  
    
    const quote =
      placedCount === 0
        ? "No placements yet."
        : `${((placedCount / totalStudents) * 100).toFixed(2)}% placement achieved this season`;
  
        return res
            .status(200)
            .json(
                new ApiResponse(200, {
                    year,
                    batch,
                    totalStudents,
                    placedCount,
                    unplacedCount: totalStudents - placedCount,
                    averagePackage: avgPackage.toFixed(2),
                    highestPackage,
                    totalOffers: placedApplications.length,
                    companyWise: companyStats,
                    quote,
                })
            );

}) 


const getRealTimeStatsYearWise = asyncHandler(async (req, res) => {
    const { year } = req.query;
  
    if (!year) {
      return res.status(400).json(new ApiResponse(400, null, "Year is required"));
    }
  
    // Helper to generate stats for a specific batch in a year
    const getBatchStats = async (year, batch) => {
      const totalStudents = await Student.countDocuments({
        admissionYear: year,
        batch,
        role: "student",
      });

        const placedApplications = await Application.aggregate(
            [
                {
                    $match: {
                    status: "PLACED",
                    placementYear: parseInt(year),
                    batch,
                    },
                },
                {
                    $group: {
                    _id: "$student",
                    company: { $first: "$company" },
                    package: { $first: "$package" },
                    },
                },
                {
                    $lookup: {
                    from: "companies",
                    localField: "company",
                    foreignField: "_id",
                    as: "companyDetails",
                    },
                },
                { $unwind: "$companyDetails" },
            ]
        );

        const placedCount = placedApplications.length;
        const totalPackage = placedApplications.reduce((acc, app) => acc + (app.package || 0), 0);
        const highestPackage = placedApplications.reduce(
        (max, app) => Math.max(max, app.package || 0),
        0
        );
        const avgPackage = placedCount > 0 ? totalPackage / placedCount : 0;

        const companyStatsMap = {};
        placedApplications.forEach(app => {
        const name = app.companyDetails.name;
        if (!companyStatsMap[name]) {
            companyStatsMap[name] = {
            companyId: app.companyDetails._id,
            companyName: name,
            placedCount: 0,
            totalPackage: 0,
            };
        }
        companyStatsMap[name].placedCount += 1;
        companyStatsMap[name].totalPackage += app.package || 0;
        });

        const companyStats = Object.values(companyStatsMap).map(stat => ({
        ...stat,
        averagePackage: stat.totalPackage / stat.placedCount,
        placementPercentage: ((stat.placedCount / totalStudents) * 100).toFixed(2),
        }));
    
        const packageBuckets = {
            "<4": 0,
            "4-6": 0,
            "6-8": 0,
            "8+": 0,
          };
          
          placedApplications.forEach(data => {
            const pkg = data.package || 0;
          
            if (pkg < 4) packageBuckets["<4"]++;
            else if (pkg >= 4 && pkg < 6) packageBuckets["4-6"]++;
            else if (pkg >= 6 && pkg < 8) packageBuckets["6-8"]++;
            else packageBuckets["8+"]++;
          });
          
          const packageDistribution = [
            { range: "< 4 LPA", count: packageBuckets["<4"] },
            { range: "4–6 LPA", count: packageBuckets["4-6"] },
            { range: "6–8 LPA", count: packageBuckets["6-8"] },
            { range: "8+ LPA", count: packageBuckets["8+"] },
          ];

        return {
        year,
        batch,
        totalStudents,
        placedCount,
        unplacedCount: totalStudents - placedCount,
        averagePackage: avgPackage.toFixed(2),
        highestPackage,
        totalOffers: placedApplications.length,
        companyWise: companyStats,
        packageDistribution,
        };
    };

    // Get all batches for this admission year
    const allBatches = await Student.distinct("batch", {
      admissionYear: year,
      role: "student",
    });
  
    const batchWiseStats = await Promise.all(
      allBatches.map(batch => getBatchStats(year, batch))
    );
  
    return res
      .status(200).
      json(
          new ApiResponse
          (
              200, 
              batchWiseStats
          )
        );

     
})


const getMonthWisePlacementStats = asyncHandler(async (req, res) => {

  const { year } = req.query;

  if (!year) {
    throw new ApiError(400, "Year is required");
  }

  const placedApplications = await Application.aggregate([
    {
      $match: {
        status: "PLACED",
        placementYear: parseInt(year),
      },
    },
    {
      $project: {
        month: { $month: "$placementDate" },
      },
    },
    {
      $group: {
        _id: "$month",
        placedCount: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const monthWiseStats = monthNames.map((name, index) => {
    const monthData = placedApplications.find(m => m._id === index + 1);
    return {
      month: name,
      placedCount: monthData ? monthData.placedCount : 0,
    };
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200, 
        {
          year,
          monthWiseStats,
        }
      )
    );
});

const getDashboardStats = asyncHandler(async (req, res) => {

  const { year } = req.query;

  if (!year) {
    throw new ApiError(400, "Year is required");
  }

  // 1. Total students of that admission year
  const totalStudents = await Student.countDocuments({
    admissionYear: parseInt(year),
    role: "student",
  });

  // 2. Total placed students (unique student IDs)
  const placedStudents = await Application.aggregate([
    {
      $match: {
        status: "PLACED",
        placementYear: parseInt(year),
      },
    },
    {
      $group: {
        _id: "$student",
      },
    },
    {
      $count: "placedCount",
    },
  ]);

  const placedCount = placedStudents.length > 0 ? placedStudents[0].placedCount : 0;

  // 3. Not placed students = total - placed
  const notPlacedCount = totalStudents - placedCount;

  // 4. Active companies (full list)
  const activeCompaniesList = await Company.find(
    { 
      status: "ACTIVE" 
    },
    { 
      _id: 1, 
      name: 1, 
      logo: 1 
    } 
  );

  const activeCompaniesCount = activeCompaniesList.length;

  return res
    .status(200)
    .json(
      new ApiResponse(
        200, 
        {
          year,
          totalStudents,
          placedStudents: placedCount,
          notPlacedStudents: notPlacedCount,
          activeCompaniesCount,
          activeCompanies: activeCompaniesList,
        }
      )
    );
});

const getAllStudents = asyncHandler(async (req, res) => {
  
  //TODO: add filters like by year if needed

  const students = await Student.find( 
    {},
    {
      name: 1,
      email: 1,
      phone: 1,
      branch: 1,
      batch: 1,
      admissionYear: 1,
      resumeLink: 1,
      placementStatus: 1,
      appliedCompanies: 1, 
      placedCompany: 1,
      createdAt: 1,
    }
  ).sort({ createdAt: -1 }); // Newest students first

  if (!students || students.length === 0) {
    throw new ApiError(404, "No students found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200, 
        students
      )
    );
});


const getAllCompanies = asyncHandler(async (req, res) => {
  
  //TODO: add filters if needed (example: active only)

  const companies = await Company.find(
    {},
    {
      name: 1,
      email: 1,
      phone: 1,
      website: 1,
      industryType: 1,
      packageOffered: 1,
      isActive: 1, 
      driveDate: 1,
      createdAt: 1,//all other info (according to model which is not present yet : "assumption game on!")
    }
  ).sort({ createdAt: -1 }); // Newest companies first

  if (!companies || companies.length === 0) {
    throw new ApiError(404, "No companies found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200, 
        companies
      )
    );
});


const getAllApplications = asyncHandler(async (req, res) => {

  const { companyId, status } = req.query;

  const query = {};

  if (companyId) {
    query.company = companyId;
  }

  if (status) {
    query.status = status.toUpperCase();
  }

  const applications = await Application.find(query)
    .sort({ createdAt: -1 });

  if (!applications || applications.length === 0) {
    throw new ApiError(404, "No applications found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200, 
        applications
      )
    );
});


const updateApplicationStatus = asyncHandler(async (req, res) => {

  const { applicationId } = req.params;
  const { newStatus } = req.body;

  if (!applicationId || !newStatus) {
    throw new ApiError(400, "Application ID and new status are required");
  }

  const validStatuses = ["PLACED", "PENDING", "REJECTED"];

  if (!validStatuses.includes(newStatus.toUpperCase())) {
    throw new ApiError(400, "Invalid status. Valid statuses are PLACED, PENDING, REJECTED");
  }

  const updatedApplication = await Application.findByIdAndUpdate(
    applicationId,
    { status: newStatus.toUpperCase() },
    { new: true }
  )

  if (!updatedApplication) {
    throw new ApiError(404, "Application not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200, 
        updatedApplication, 
        "Application status updated successfully"
      )
    );
});


const addEmailsToAllowedList = asyncHandler(async (req, res) => {

    const { emails } = req.body; 

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
        throw new ApiError(400, "Invalid input. Please provide an array of emails.");
    }

    const invalidEmails = emails.filter(email => !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email));
    
    if (invalidEmails.length > 0) {
        throw new ApiError(400, `Invalid email format: ${invalidEmails.join(", ")}`);
    }

    const emailObjects = emails.map(email => ({ email }));

    try {
        const result = await AllowedEmail.insertMany(emailObjects, { ordered: false });

        return res.status(200).json({
            success: true,
            message: `${result.length} emails added to allowed list successfully.`,
            data: result,
        });
    } catch (error) {
        if (error.code === 11000) {
            throw new ApiError(400, "One or more emails are already in the allowed list.");
        }
        throw new ApiError(500, "Something went wrong. Please try again later.",error);
    }
});









export {
  generateAccessAndRefreshTokens,
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  listCompanies,
  createCompany,
  getApplicantsForCompany,
  getEligibleStudents,
  notifyStudents,
  delistCompany,
  getRealTimeStats,
  getRealTimeStatsYearWise,
  getMonthWisePlacementStats,
  getDashboardStats,
  getAllStudents,
  getAllCompanies,
  getAllApplications,
  updateApplicationStatus,
  addEmailsToAllowedList

}