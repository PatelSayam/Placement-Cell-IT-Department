import mongoose from 'mongoose';

//skip require field as no filed as any compulsion!!

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
});

export default mongoose.model('Student', studentSchema);
