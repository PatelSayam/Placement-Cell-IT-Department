import mongoose from "mongoose";
import { sendEmail } from "../utils/Nodemailer"
import emailTemplate from "../utils/emailTemplate"
import { ApiError } from "../utils/ApiError";

const OtpSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 60*10
    }
});

async function sendVerificationEmail(email, otp) {
    try {
        sendEmail(
            email,
            "Verification Email",
            emailTemplate(otp)
        );  
    } catch (error) {
        console.log("Error occurred while sending email", error);
        throw new ApiError(500, "Otp does not send successfully");
    }
}

OtpSchema.pre("save", async function (next) {
    
    // here "this" refers the document being saved
    if(this.isNew) {
        await sendVerificationEmail(this.email, this.otp);
    }
    next();
})

const Otp = mongoose.model("Otp", OtpSchema);

export default Otp;