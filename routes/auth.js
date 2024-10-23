const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Company = require('../models/Company');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenUtils');
const { sendEmail, sendSms } = require('../utils/otp');

const router = express.Router();

// Register a new company
router.post('/register', async (req, res) => {
    const { name, phoneNumber, companyName, companyEmail, employeeSize } = req.body;

    try {
        let company = await Company.findOne({ companyEmail });
        if (company) return res.status(400).json({ message: 'Company already registered, please Login' });

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

        // sendEmail(companyEmail, emailOtp)
        // sendSms(phoneNumber, phoneOtp);

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

// Verify Phone OTP
router.post('/verify-phone-otp', async (req, res) => {
    const { companyEmail, phoneOtp } = req.body;
    let accessToken = "";
    
    try {
        const company = await Company.findOne({ companyEmail });
        if (!company) return res.status(400).json({ message: 'Company not found' });
        
        if (company.phoneOtp && company.phoneOtp !== phoneOtp) return res.status(400).json({ message: 'Invalid OTP' });
        if (company.otpExpiration < new Date()) return res.status(400).json({ message: 'expired OTP' });
        
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

// Resend Email OTP
router.post('/login', async (req, res) => {
    const { companyEmail } = req.body;
    
    try {
        const company = await Company.findOne({ companyEmail });
        if (!company) return res.status(400).json({ message: 'Company not found' });

        if (!company.isPhoneVerified) {
            company.phoneOtp = crypto.randomInt(100000, 999999).toString(); 
            // sendSms(phoneNumber, phoneOtp);
        }
        
        company.isEmailVerified = false
        company.emailOtp = crypto.randomInt(100000, 999999).toString();
        company.otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 min
        await company.save();
        
        // sendEmail(companyEmail, emailOtp)

        const { emailOtp: _, phoneOtp: __, ...companyData } = company.toObject();
        res.json({ companyData });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
