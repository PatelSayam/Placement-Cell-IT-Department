import mongoose from "mongoose";

const allowedEmailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
});

export const AllowedEmail = mongoose.model("AllowedEmail", allowedEmailSchema);
