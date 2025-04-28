import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  status: {
    type: String,
    enum: ['PENDING', 'PLACED', 'REJECTED'],
    default: 'PENDING'
  },
  resume: {
    type: String,
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Application', applicationSchema);
