import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  try {
    let transporter;

    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      // Use real SMTP server from .env
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Generate test SMTP service account from ethereal.email
      let testAccount = await nodemailer.createTestAccount();
      
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        },
      });
    }

    // Define the email options
    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'CutPro Admin'}" <${process.env.SMTP_FROM_EMAIL || 'noreply@cutpro.com'}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.htmlMessage || `<p>${options.message}</p>`,
    };

    // Actually send the email
    const info = await transporter.sendMail(mailOptions);
    
    // Log URL to preview the email if using Ethereal
    if (!process.env.SMTP_HOST) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email could not be sent");
  }
};

export default sendEmail;
