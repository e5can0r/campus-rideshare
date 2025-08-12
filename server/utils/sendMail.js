import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail', // or 'hotmail', 'yahoo' etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends a join notification email to ride creator
 * @param {string} toEmail - Email of the ride creator
 * @param {string} joinedUserName - Name of the person who joined
 * @param {object} ride - Ride details (originCity, travelDate, etc.)
 */
export const sendJoinNotification = async (toEmail, joinedUserName, ride) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: `${joinedUserName} has joined your ride!`,
    text: `Hello,

${joinedUserName} has joined your ride from ${ride.originCity} on ${ride.travelDate}.

Login to the app to chat and coordinate.

- Campus RideShare`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('📧 Email sent to', toEmail);
  } catch (err) {
    console.error('❌ Error sending email:', err);
  }
};
