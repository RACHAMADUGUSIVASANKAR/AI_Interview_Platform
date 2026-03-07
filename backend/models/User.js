const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 8
    },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    education: [{
        degree: String,
        institution: String,
        year: String,
        grade: String
    }],
    skills: [{ type: String }],
    projects: [{
        title: String,
        description: String,
        technologies: String,
        link: String
    }],
    experience: [{
        company: String,
        role: String,
        duration: String,
        description: String
    }],
    resume: { type: String, default: '' },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
