const mongoose = require('mongoose');

const interviewSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['hr', 'technical', 'behavioral', 'coding', 'jam', 'group-discussion', 'puzzle', 'aptitude', 'ai-interview'],
        required: true
    },
    role: { type: String, default: '' },
    questions: [{
        question: String,
        userAnswer: String,
        score: Number,
        feedback: String,
        strengths: [String],
        improvements: [String]
    }],
    overallScore: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    feedback: { type: String, default: '' },
    completedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
