const express = require('express');
const authMiddleware = require('../middleware/auth');
const InterviewSession = require('../models/InterviewSession');

const router = express.Router();

// POST /api/interview/save
router.post('/save', authMiddleware, async (req, res) => {
    try {
        const { type, role, questions, overallScore, totalQuestions, duration, feedback } = req.body;

        const session = new InterviewSession({
            userId: req.userId,
            type,
            role,
            questions,
            overallScore,
            totalQuestions,
            duration,
            feedback
        });

        await session.save();
        res.status(201).json({ message: 'Interview session saved', session });
    } catch (error) {
        console.error('Save interview error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/interview/history
router.get('/history', authMiddleware, async (req, res) => {
    try {
        const sessions = await InterviewSession.find({ userId: req.userId })
            .sort({ completedAt: -1 })
            .limit(50);
        res.json(sessions);
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/interview/stats
router.get('/stats', authMiddleware, async (req, res) => {
    try {
        const sessions = await InterviewSession.find({ userId: req.userId });
        const totalSessions = sessions.length;
        const avgScore = totalSessions > 0
            ? Math.round(sessions.reduce((sum, s) => sum + s.overallScore, 0) / totalSessions)
            : 0;

        const typeStats = {};
        sessions.forEach(s => {
            if (!typeStats[s.type]) {
                typeStats[s.type] = { count: 0, totalScore: 0 };
            }
            typeStats[s.type].count++;
            typeStats[s.type].totalScore += s.overallScore;
        });

        Object.keys(typeStats).forEach(key => {
            typeStats[key].avgScore = Math.round(typeStats[key].totalScore / typeStats[key].count);
        });

        res.json({
            totalSessions,
            avgScore,
            typeStats,
            recentSessions: sessions.sort((a, b) => b.completedAt - a.completedAt).slice(0, 10)
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
