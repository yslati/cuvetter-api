const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    companyName: { type: String, required: true },
    companyEmail: { type: String, required: true, unique: true },
    employeeSize: { type: Number, required: true },
    emailOtp: { type: String, required: false },
    phoneOtp: { type: String, required: false },
    otpExpiration: { type: Date, required: true },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
