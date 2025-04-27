import { Router } from "express";
import { 
    applyToJob, 
    getApplicant, 
    getCompany, 
    changeApplicationState 
} from "../controllers/application.controller.js";
import { verifyStudent } from "../middlewares/auth.middleware.js"; // Assuming student auth
import { verifyAdmin } from "../middlewares/auth.middleware.js"; // Admin for status change

const router = Router()

// Apply to a company (student route)
router.post("/apply/:companyId", verifyStudent, applyToJob);

// Get all applicants for a company (admin route)
router.get("/applicants/:companyId", verifyAdmin, getApplicant);

// Get all companies a student applied to (student route)
router.get("/companies/applied", verifyStudent, getCompany);

// Admin changes application status
router.patch("/application/:companyId/:studentId", verifyAdmin, changeApplicationState);

export default router;
