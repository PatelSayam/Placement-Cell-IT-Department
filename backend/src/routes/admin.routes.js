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
    getDashboardStats
} from "../controllers/admin.controller.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js"; // Assuming you have auth middleware

const router = Router()

// Auth Routes
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/logout", verifyAdmin, logoutAdmin);

// Company Management
router.get("/companies", verifyAdmin, listCompanies);
router.post("/companies", verifyAdmin, createCompany);
router.patch("/companies/:companyId/delist", verifyAdmin, delistCompany);

// Applications & Students
router.get("/companies/:companyId/applicants", verifyAdmin, getApplicantsForCompany);
router.get("/companies/:companyId/eligible-students", verifyAdmin, getEligibleStudents);

// Notify Students
router.post("/notify", verifyAdmin, notifyStudents);

// Statistics Routes
router.get("/stats/realtime", verifyAdmin, getRealTimeStats);
router.get("/stats/realtime/yearwise", verifyAdmin, getRealTimeStatsYearWise);
router.get("/stats/monthwise", verifyAdmin, getMonthWisePlacementStats);

// Dashboard
router.get("/dashboard", verifyAdmin, getDashboardStats);

export default router;
