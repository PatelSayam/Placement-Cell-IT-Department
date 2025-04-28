import { Router } from "express";
import { 
    applyToJob, 
    getApplicant, 
    getCompany, 
    changeApplicationState 
} from "../controllers/application.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"; 
import { verifyJWTAdmin } from "../middlewares/admin.auth.middleware.js"; 
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

// Apply to a company (student route)
router.post("/apply/:companyId", verifyJWT, upload.fields(
    [
        { 
            name: 'resume', 
            maxCount: 1 
        }
    ]
) , applyToJob);

// Get all applicants for a company (admin route)
router.get("/applicants/:companyId", verifyJWTAdmin, getApplicant);

// Get all companies a student applied to (student route)
router.get("/companies/applied", verifyJWT, getCompany);

// Admin changes application status
router.patch("/application/:companyId/:studentId", verifyJWTAdmin, changeApplicationState);

export default router;
