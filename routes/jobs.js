const express = require('express');
const mongoose = require('mongoose');
const authenticate = require('../middleware/authenticate');
const Job = require('../models/Job');
const Company = require('../models/Company');
const { jobSchema } = require('../utils/jobValidation');
const { sendJobEmail } = require('../utils/otp');

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

        const emailPromises = candidate.map((email) => {
            const emailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: `New Job Opportunity: ${jobTitle}`,
                text: `Hi,\n\nA new job has been posted:\n\nTitle: ${jobTitle}\nDescription: ${jobDescription}\nExperience Level: ${experienceLevel}\nEnd Date: ${endDate}\n\nBest,\n${company.name}`
            };
            return sendJobEmail(emailOptions);
        });
        await Promise.all(emailPromises);

        res.json({ message: 'Job posted successfully', job });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Get all jobs posted by the logged-in company
router.get('/company-jobs', authenticate, async (req, res) => {    
    try {
        const companyId = req.companyId;
        if (!companyId) return res.status(400).json({ message: "Company ID not found" });

        const jobs = await Job.find({ companyId });

        res.json({ jobs });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
