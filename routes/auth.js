const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Company = require('../models/Company');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenUtils');
const { Vonage } = require('@vonage/server-sdk');

const router = express.Router();

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

// Register a new company
router.post('/register', async (req, res) => {
    const { name, phoneNumber, companyName, companyEmail, employeeSize } = req.body;

    try {
        let company = await Company.findOne({ companyEmail });
        if (company) return res.status(400).json({ message: 'Company already registered' });

        const emailOtp = crypto.randomInt(100000, 999999).toString();
        const phoneOtp = crypto.randomInt(100000, 999999).toString();
        const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 min

        company = new Company({
            name,
            phoneNumber,
            companyName,
            companyEmail,
            employeeSize,
            emailOtp,
            phoneOtp,
            otpExpiration,
        });

        await company.save();

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: companyEmail,
            subject: 'Your OTP for Verification',
            text: `Your email verification OTP is: ${emailOtp}`,
        });

        // SMS OTP
        // await vonage.sms.send({
        //     to: phoneNumber,
        //     from: 'Cuvette',
        //     text: `Your phone verification OTP is: ${phoneOtp}`,
        // }).then((res) => { console.log('Message sent successfully'); console.log(res); })
        // .catch((err) => { console.log('There was an error sending the messages.'); console.error(err); });

        const { emailOtp: _, phoneOtp: __, ...companyData } = company.toObject();
        res.json({ message: 'Registration successful. Please verify your email and phone number.', companyData });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Verify Email OTP
router.post('/verify-email-otp', async (req, res) => {
    const { companyEmail, emailOtp } = req.body;
    let accessToken = "";

    try {
        const company = await Company.findOne({ companyEmail });
        if (!company) return res.status(400).json({ message: 'Company not found' });

        if (company.emailOtp && company.emailOtp !== emailOtp) return res.status(400).json({ message: 'Invalid OTP' });
        if (company.otpExpiration < new Date()) return res.status(400).json({ message: 'expired OTP' });

        
        company.isEmailVerified = true;
        company.emailOtp = "";
        if (company.isPhoneVerified) {
            company.isVerified = true;
            company.refreshToken = generateRefreshToken();
            accessToken = generateAccessToken(company._id);
        }
        await company.save();
        const { emailOtp: _, phoneOtp: __, ...companyData } = company.toObject();
        
        res.json({ accessToken, companyData, message: 'Account verified successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Resend Email OTP
router.post('/resend-email-otp', async (req, res) => {
    const { companyEmail } = req.body;
    
    try {
        const company = await Company.findOne({ companyEmail });
        if (!company) return res.status(400).json({ message: 'Company not found' });

        if (company.isEmailVerified) return res.status(400).json({ message: 'Email is already verified.' });

        const newEmailOtp = crypto.randomInt(100000, 999999).toString();
        const newOtpExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 min
        
        company.emailOtp = newEmailOtp;
        company.otpExpiration = newOtpExpiration;
        await company.save();
        
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: companyEmail,
            subject: 'Your OTP for Verification',
            text: `Your email verification OTP is: ${emailOtp}`,
        });

        res.json({ message: 'A new OTP has been sent to your email.' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Verify Phone OTP
router.post('/verify-phone-otp', async (req, res) => {
    const { companyEmail, phoneOtp } = req.body;
    let accessToken = "";
    
    try {
        const company = await Company.findOne({ companyEmail });
        if (!company) return res.status(400).json({ message: 'Company not found' });
        
        if (company.phoneOtp && company.phoneOtp !== phoneOtp) return res.status(400).json({ message: 'Invalid OTP' });
        if (company.otpExpiration < new Date()) return res.status(400).json({ message: 'expired phone OTP' });
        
        company.isPhoneVerified = true;
        company.phoneOtp = "";
        if (company.isEmailVerified) {
            company.isVerified = true;
            company.refreshToken = generateRefreshToken();
            accessToken = generateAccessToken(company._id);
        }
        await company.save();
        const { emailOtp: _, phoneOtp: __, ...companyData } = company.toObject();

        res.json({ accessToken, companyData, message: 'Account verified successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Refresh the JWT token
router.post('/refresh-token', async (req, res) => {
    const { companyEmail, refreshToken } = req.body;

    try {
        const company = await Company.findOne({ companyEmail });
        if (!company) return res.status(400).json({ message: 'Company not found' });

        if (company.refreshToken !== refreshToken) {
            return res.status(400).json({ message: 'Invalid refresh token' });
        }

        const newAccessToken = jwt.sign({ companyId: company._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ accessToken: newAccessToken });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
