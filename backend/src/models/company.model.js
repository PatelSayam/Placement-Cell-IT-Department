import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: String,
  jobRole: String,
  description: String,
  skillsRequired: [String],
  eligibleCriteria: {
    minCGPA: Number,
    allowedBacklogs: Number,
    allowedBranches: [String],
    passoutYear: Number
  },
  deadline: Date,
  status: {
    type: String,
    enum: ['active', 'delisted',],
    default: 'active'
  },
  year: Number,
  batch: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Company', companySchema);
