import React, { useState } from 'react';
import { API } from '../../../context/AuthContext';
import InterviewSetup from './InterviewSetup';

const hrQuestions = [
    "Tell me about yourself.",
    "Why should we hire you?",
    "What are your strengths and weaknesses?",
    "Where do you see yourself in 5 years?",
    "Why do you want to work here?",
    "Tell me about a time you faced a challenge at work.",
    "How do you handle pressure or stressful situations?",
    "What motivates you?",
    "Describe your ideal work environment.",
    "What are your salary expectations?",
    "Why are you leaving your current job?",
    "How do you handle criticism?",
    "Tell me about your greatest achievement.",
    "Do you prefer working alone or in a team?",
    "How do you prioritize your work?",
    "What makes you unique?",
    "Tell me about a time you showed leadership.",
    "How do you stay updated in your field?",
    "What are your career goals?",
    "Do you have any questions for us?",
    "How would your colleagues describe you?",
    "Tell me about a failure and what you learned.",
    "What do you know about our company?",
    "How do you manage work-life balance?",
    "Describe a difficult decision you had to make."
];

function evaluateAnswer(answer) {
    const wordCount = answer.trim().split(/\s+/).length;
    const hasStructure = answer.includes('.') && wordCount > 15;
    const hasExamples = /for example|such as|instance|when i|in my/i.test(answer);
    const isDetailed = wordCount > 30;
    let score = 4;
    if (wordCount > 10) score += 1;
    if (hasStructure) score += 1.5;
    if (hasExamples) score += 1.5;
    if (isDetailed) score += 1;
    if (wordCount > 50) score += 1;
    score = Math.min(10, Math.round(score * 10) / 10);
    return {
        score,
        strengths: [
            ...(hasStructure ? ['Well-structured response'] : []),
            ...(hasExamples ? ['Good use of examples'] : []),
            ...(isDetailed ? ['Detailed explanation'] : []),
            ...(wordCount > 30 ? ['Adequate length'] : [])
        ],
        improvements: [
            ...(!hasStructure ? ['Add more structure with complete sentences'] : []),
            ...(!hasExamples ? ['Include specific examples from experience'] : []),
            ...(wordCount < 20 ? ['Provide a more detailed response'] : []),
            ...(!isDetailed ? ['Elaborate with more context and reasoning'] : [])
        ],
        clarity: wordCount > 20 ? 'Good' : 'Needs Improvement',
        confidence: hasStructure ? 'Confident' : 'Moderate'
    };
}

function HRInterview() {
    const [currentQ, setCurrentQ] = useState(0);
    const [answer, setAnswer] = useState('');
    const [results, setResults] = useState([]);
    const [showFeedback, setShowFeedback] = useState(false);
    const [currentFeedback, setCurrentFeedback] = useState(null);
    const [completed, setCompleted] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [isSetupComplete, setIsSetupComplete] = useState(false);

    const handleSubmit = () => {
        if (!answer.trim()) return;
        const feedback = evaluateAnswer(answer);
        const result = { question: hrQuestions[currentQ], answer, feedback };
        setResults([...results, result]);
        setCurrentFeedback(feedback);
        setShowFeedback(true);
    };

    const handleNext = () => {
        setAnswer('');
        setShowFeedback(false);
        setCurrentFeedback(null);
        if (currentQ + 1 >= hrQuestions.length) {
            setCompleted(true);
            saveToDatabase([...results, { question: hrQuestions[currentQ], answer, feedback: currentFeedback }]);
        } else {
            setCurrentQ(currentQ + 1);
        }
    };

    const saveToDatabase = async (allResults) => {
        try {
            const duration = Math.round((Date.now() - startTime) / 1000);
            const avgScore = allResults.reduce((s, r) => s + r.feedback.score, 0) / allResults.length;
            await API.post('/interview/save', {
                type: 'hr',
                questions: allResults.map(r => ({
                    question: r.question, userAnswer: r.answer, score: r.feedback.score * 10,
                    strengths: r.feedback.strengths, improvements: r.feedback.improvements
                })),
                overallScore: Math.round(avgScore * 10),
                totalQuestions: allResults.length,
                duration
            });
        } catch (err) { console.error('Failed to save session:', err); }
    };

    const avgScore = results.length > 0
        ? (results.reduce((s, r) => s + r.feedback.score, 0) / results.length).toFixed(1) : 0;

    if (!isSetupComplete) {
        return (
            <InterviewSetup
                title="HR Interview Preparation"
                description="Practice answering common behavioral and personality questions asked by Human Resources to evaluate your cultural fit and soft skills."
                requirements={[
                    "A quiet environment with no distractions",
                    "Clear microphone and camera recommended (though optional for this text-based practice)",
                    "Stable internet connection"
                ]}
                tips={[
                    "Use the STAR method (Situation, Task, Action, Result) for behavioral questions.",
                    "Be honest but emphasize positive outcomes and learnings.",
                    "Keep your answers concise, ideally between 30 and 60 words.",
                    "Always sound enthusiastic and maintain a professional tone."
                ]}
                onStart={() => {
                    setStartTime(Date.now());
                    setIsSetupComplete(true);
                }}
            />
        );
    }

    if (completed) {
        return (
            <div className="interview-module">
                <div className="completion-card glass-card">
                    <h2>HR Interview Completed!</h2>
                    <div className="final-score">
                        <span className="big-score">{avgScore}</span>
                        <span className="score-label">/10 Average Score</span>
                    </div>
                    <p>You answered {results.length} questions.</p>
                    <div className="results-summary">
                        {results.map((r, i) => (
                            <div className="result-item" key={i}>
                                <span className="result-q">Q{i + 1}: {r.question}</span>
                                <span className={`result-score ${r.feedback.score >= 7 ? 'high' : r.feedback.score >= 5 ? 'medium' : 'low'}`}>{r.feedback.score}/10</span>
                            </div>
                        ))}
                    </div>
                    <button className="btn btn-primary" onClick={() => { setCurrentQ(0); setResults([]); setCompleted(false); }}>Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="interview-module">
            <div className="interview-header">
                <h1 className="text-4xl font-semibold text-white uppercase mb-4">HR Interview</h1>
                <p className="page-subtitle text-xl text-white font-normal mb-12">25+ Standard HR questions with AI feedback</p>
                <div className="progress-info">
                    <span className="text-white font-semibold">Question {currentQ + 1} of {hrQuestions.length}</span>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${((currentQ + 1) / hrQuestions.length) * 100}%` }}></div></div>
                </div>
            </div>
            <div className="question-card glass-card">
                <span className="q-number">Q{currentQ + 1}</span>
                <h3>{hrQuestions[currentQ]}</h3>
            </div>
            {!showFeedback ? (
                <div className="answer-section">
                    <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type your answer here... Be detailed and include examples." rows={6} />
                    <button className="btn btn-primary" onClick={handleSubmit} disabled={!answer.trim()}>Submit Answer</button>
                </div>
            ) : (
                <div className="feedback-card glass-card">
                    <div className="feedback-header">
                        <h3>AI Feedback</h3>
                        <span className={`feedback-score ${currentFeedback.score >= 7 ? 'high' : currentFeedback.score >= 5 ? 'medium' : 'low'}`}>Score: {currentFeedback.score}/10</span>
                    </div>
                    <div className="feedback-metrics">
                        <div className="metric">Clarity: {currentFeedback.clarity}</div>
                        <div className="metric">Confidence: {currentFeedback.confidence}</div>
                    </div>
                    <div className="feedback-section"><h4>Strengths</h4><ul>{currentFeedback.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
                    <div className="feedback-section"><h4>Areas to Improve</h4><ul>{currentFeedback.improvements.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
                    <button className="btn btn-primary" onClick={handleNext}>{currentQ + 1 >= hrQuestions.length ? 'View Results' : 'Next Question'}</button>
                </div>
            )}
        </div>
    );
}

export default HRInterview;
