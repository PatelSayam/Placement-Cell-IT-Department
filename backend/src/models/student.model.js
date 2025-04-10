import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


//skip require field as no filed has any compulsion!!

const studentSchema = new mongoose.Schema({
  collegeEmail: String,
  personalEmail: String,
  rollNo: String,
  collegeId: String,
  fullName: String,
  gender: String,
  dob: Date,
  profilePhotoUrl: String,

  ssc: {
    result: String,
    passingYear: Number,
    board: String,
    marksheetUrl: String
  },
  hsc: {
    result: String,
    passingYear: Number,
    board: String,
    marksheetUrl: String
  },
  diploma: {
    result: String,
    boardOrUniversity: String,
    passingYear: Number,
    degreePdfUrl: String
  },

  contactNumber: String,
  parentContactNumber: String,
  parentEmail: String,
  permanentAddress: {
    addressLine: String,
    city: String,
    pincode: String
  },

  backlogs: {
    active: Number,
    total: Number
  },
  breakYears: {
    count: Number,
    reason: String
  },

  category: String,
  admissionQuota: String,

  skills: [String],
  preferredRoles: [String],
  projects: [
    {
      title: String,
      description: String
    }
  ],
  certifications: [String],
  socialLinks: {
    github: String,
    hackerrank: String,
    leetcode: String,
    codechef: String,
    linkedin: String
  },

  resumeUrl: String,
  detailsVerified: { type: Boolean, default: false },

  password: String,
  resetToken: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
},
{
  timestamps: true
});


studentSchema.pre("save", async function (next) {
  // Skip password hashing if the password is not modified or if the user is Google-authenticated
  if (!this.isModified("password") || !this.password) return next();

  // Hash the password only if it exists
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

studentSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password); // Compare hashed passwords
};

studentSchema.methods.generateAccessToken = function () {
  return jwt.sign(
      {
          _id: this._id,
          email: this.collegeEmail,
          username: this.fullname,
          fullname: this.fullname,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};
studentSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
      { _id: this._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

export default mongoose.model('Student', studentSchema);
