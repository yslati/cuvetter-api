const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    jobTitle: { type: String, required: true },
    jobDescription: { type: String, required: true },
    experienceLevel: { type: String, required: true },
    candidates: [{ type: String }],
    endDate: { type: Date, required: true },
    postedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', JobSchema);
