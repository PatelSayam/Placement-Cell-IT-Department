//to store the history to sent email and making email service as model 
// makes it easy to retry to send email and also keep track to notifications pushed by TPO
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  studentIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  subject: String,
  body: String,
  sentAt: {
    type: Date,
    default: Date.now
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
});

export default mongoose.model('Notification', notificationSchema);
