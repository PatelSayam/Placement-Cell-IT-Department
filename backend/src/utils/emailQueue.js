
import Bull from 'bull';
import nodemailer from 'nodemailer';
import { redisConfig } from './redisConfig.js';


const emailQueue = new Bull('emailQueue', redisConfig);


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'email@gmail.com', 
    pass: 'email-password',   
  },
});


emailQueue.process(async (job) => {
  const { to, subject, text } = job.data;

  try {

    await transporter.sendMail({
      from: 'email@gmail.com', 
      to,
      subject,
      text,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    throw new Error('Failed to send email');
  }
});

export default emailQueue;
