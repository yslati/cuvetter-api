const express = require('express');
const mongoose = require('mongoose');
const authenticate = require('../middleware/authenticate');
const Job = require('../models/Job');
const Company = require('../models/Company');
const { jobSchema } = require('../utils/jobValidation');

const router = express.Router();

// Post a new job
router.post('/post-job', authenticate, async (req, res) => {
    const { companyId, jobTitle, jobDescription, experienceLevel, candidate, endDate } = req.body;

    try {
        const company = await Company.findById(companyId);
        if (!company || !company.isEmailVerified || !company.isPhoneVerified) {
            return res.status(400).json({ message: 'Company not verified or not found' });
        }

        const { error } = jobSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const job = new Job({
            companyId,
            jobTitle,
            jobDescription,
            experienceLevel,
            candidate,
            endDate
        });
        await job.save();

        res.json({ message: 'Job posted successfully', job });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
