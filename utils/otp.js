const nodemailer = require('nodemailer');
const { Vonage } = require('@vonage/server-sdk');

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const vonage = new Vonage({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET,
});

const sendEmail = async (companyEmail, emailOtp) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: companyEmail,
            subject: 'Your OTP for Verification',
            text: `Your email verification OTP is: ${emailOtp}`,
        });
        console.log('Email sent successfully');
    } catch (err) {
        console.log('There was an error sending the email.');
        console.error(err);
    }
};

const sendJobEmail = async (emailOptions) => {
    try {
        await transporter.sendMail(emailOptions);
        console.log('Job Email sent successfully');
    } catch (err) {
        console.log('There was an error sending the Job email.');
        console.error(err);
    }
};

const sendSms = async (phoneNumber, phoneOtp) => {
    try {
        const response = await vonage.sms.send({
            to: phoneNumber,
            from: 'Cuvette',
            text: `Your phone verification OTP is: ${phoneOtp}`,
        });
        console.log('Message sent successfully');
        console.log(response);
    } catch (err) {
        console.log('There was an error sending the messages.');
        console.error(err);
    }
};

module.exports = { sendEmail, sendSms, sendJobEmail };