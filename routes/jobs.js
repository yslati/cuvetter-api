const express = require('express');
const mongoose = require('mongoose');
const authenticate = require('../middleware/authenticate');
const Job = require('../models/Job');
const Company = require('../models/Company');

const router = express.Router();

// Post a new job
router.post('/post-job', authenticate, async (req, res) => {
    const { jobTitle, jobDescription, experienceLevel, candidates, endDate } = req.body;
    const companyId = req.companyId;

    try {
        const company = await Company.findById(companyId);
        if (!company || !company.isEmailVerified) {
            return res.status(400).json({ message: 'Company not verified or not found' });
        }

        const job = new Job({
            companyId,
            jobTitle,
            jobDescription,
            experienceLevel,
            candidates,
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
