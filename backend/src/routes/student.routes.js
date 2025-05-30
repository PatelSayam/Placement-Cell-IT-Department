import { Router } from "express";
import { 
    changePassword, 
    getAllStudents, 
    getCurrentStudent, 
    loginStudent, 
    logoutStudent, 
    refreshAccessToken, 
    registerStudent, 
    registerStudentSM, 
    registerWithOtp, 
    sendOtp, 
    updateAccountDetails, 
    verifyOtp, 
    viewProfile 
} from "../controllers/student.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"

const router = Router()

router.route("/register").post(
    upload.fields(
        [
            { 
                name: 'resume', 
                maxCount: 1 
            },
            { 
                name: 'hscMarksheet', 
                maxCount: 1 
            },
            { 
                name: 'sscMarksheet', 
                maxCount: 1 
            },
            { 
                name: 'diplomaMarksheet', 
                maxCount: 1 
            },
            { 
                name: 'profilePhoto', 
                maxCount: 1 
            }
        ]
    ),registerStudent
)

router.route("/login").post(loginStudent)
router.post(
    '/register-student-sm',
    upload.fields([
      { name: 'profilePhoto', maxCount: 1 },
      { name: 'sscMarksheet', maxCount: 1 },
      { name: 'hscMarksheet', maxCount: 1 },
      { name: 'diplomaDegree', maxCount: 1 },
      { name: 'resume', maxCount: 1 },
    ]),
    registerStudentSM
  );
// //secured routes 

router.route("/logout").post(verifyJWT, logoutStudent)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changePassword)
router.route("/get-current-student").post(verifyJWT, getCurrentStudent)
router.route("/view-profile").post(viewProfile)
router.route("/get-all-students").get(getAllStudents)

router.route("/update-account-details").post( 
    upload.fields(
        [
            { 
                name: 'resume', 
                maxCount: 1 
            },
            { 
                name: 'hscMarksheet', 
                maxCount: 1 
            },
            { 
                name: 'sscMarksheet', 
                maxCount: 1 
            },
            { 
                name: 'diplomaMarksheet', 
                maxCount: 1 
            },
            { 
                name: 'profilePhoto', 
                maxCount: 1 
            }
        ]
    ), updateAccountDetails
)

router.route("/send-otp").post(sendOtp)
router.route("/verify-otp").post(verifyOtp);
router.route("/register-with-otp").post(registerWithOtp);




export default router   