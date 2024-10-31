const Joi = require("joi");

const jobSchema = Joi.object({
    companyId: Joi.string().required(),
    jobTitle: Joi.string().min(3).max(100).required(),
    jobDescription: Joi.string().min(10).max(2000).required(),
    experienceLevel: Joi.string().valid('Junior Developer', 'Mid-Level Developer', 'Senior Developer', 'Lead Developer').required(),
    candidate: Joi.array().items(Joi.string().email()).min(1).required(),
    endDate: Joi.date().iso().greater('now').required(),
});

module.exports = { jobSchema };