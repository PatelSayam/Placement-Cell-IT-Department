import Bull from 'bull';
import nodemailer from 'nodemailer';
import redisConfig from './redisConfig.js';

// ✅ Define emailQueue with retry options
const emailQueue = new Bull('emailQueue', {
  ...redisConfig,
  defaultJobOptions: {
    attempts: 3,                // Retry up to 3 times
    backoff: {
      type: 'exponential',     // Backoff strategy
      delay: 10000              // Start with 5 seconds delay
    },
    removeOnComplete: true,    // Clean up successful jobs
    removeOnFail: false        // Keep failed jobs for inspection/retry
  }
});

// ✅ Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Job processor
emailQueue.process(async (job) => {
  const { to, subject, text } = job.data;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,  // Use dynamic from email
      to,
      subject,
      text,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}`, error);
    throw new Error('Failed to send email');
  }
});

export default emailQueue;
