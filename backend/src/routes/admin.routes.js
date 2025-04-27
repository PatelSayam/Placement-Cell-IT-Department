import { Router } from "express";
import { 
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
    addEmailsToAllowedList
} from "../controllers/admin.controller.js";
import { verifyJWTAdmin } from "../middlewares/admin.auth.middleware.js"; // Assuming you have auth middleware

const router = Router()

// Auth Routes
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/logout", verifyJWTAdmin, logoutAdmin);

// Company Management
router.get("/companies", verifyJWTAdmin, listCompanies);
router.post("/companies", verifyJWTAdmin, createCompany);
router.patch("/companies/:companyId/delist", verifyJWTAdmin, delistCompany);

// Applications & Students
router.get("/companies/:companyId/applicants", verifyJWTAdmin, getApplicantsForCompany);
router.get("/companies/:companyId/eligible-students", verifyJWTAdmin, getEligibleStudents);

// Notify Students
router.post("/notify", verifyJWTAdmin, notifyStudents);

// Statistics Routes
router.get("/stats/realtime", verifyJWTAdmin, getRealTimeStats);
router.get("/stats/realtime/yearwise", verifyJWTAdmin, getRealTimeStatsYearWise);
router.get("/stats/monthwise", verifyJWTAdmin, getMonthWisePlacementStats);

// Dashboard
router.get("/dashboard", verifyJWTAdmin, getDashboardStats);
router.post("/add-emails", addEmailsToAllowedList);

export default router;
