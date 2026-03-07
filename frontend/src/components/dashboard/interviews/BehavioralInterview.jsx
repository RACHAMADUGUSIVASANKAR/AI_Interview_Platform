import React, { useState } from 'react';
import { API } from '../../../context/AuthContext';
import InterviewSetup from './InterviewSetup';

const behavioralQuestions = [
    "Describe a challenging situation you faced at work and how you solved it.",
    "Tell me about a time you had to work with a difficult team member.",
    "Give an example of when you showed leadership.",
    "Describe a situation where you had to meet a tight deadline.",
    "Tell me about a time you failed and what you learned.",
    "How did you handle a situation where you disagreed with your manager?",
    "Describe a time when you had to adapt to change quickly.",
    "Tell me about your most significant professional achievement.",
    "Give an example of when you went above and beyond.",
    "Describe a time you had to make a difficult decision under pressure.",
    "Tell me about a conflict you resolved within a team.",
    "Describe a situation where you had to persuade others.",
    "Give an example of how you prioritized multiple tasks.",
    "Tell me about a time you received constructive criticism.",
    "Describe a situation where you showed initiative.",
    "Tell me about a time you mentored someone.",
    "Describe how you handled an ethical dilemma.",
    "Give an example of creative problem-solving.",
    "Tell me about a project that didn't go as planned.",
    "Describe a time you had to learn something new quickly.",
    "Tell me about a time you demonstrated empathy.",
    "Describe a situation where you used data to make a decision."
];

function evaluateAnswer(answer) {
    const wordCount = answer.trim().split(/\s+/).length;
    const hasStorytelling = /when|situation|then|result|outcome|because|so i/i.test(answer);
    const hasLeadership = /led|managed|coordinated|organized|initiated|decided|responsible/i.test(answer);
    const hasProblemSolving = /solved|analyzed|figured|approach|strategy|solution|resolved/i.test(answer);
    let score = 4;
    if (wordCount > 15) score += 1;
    if (hasStorytelling) score += 2;
    if (hasLeadership) score += 1.5;
    if (hasProblemSolving) score += 1.5;
    return {
        score: Math.min(10, Math.round(score * 10) / 10),
        storytelling: hasStorytelling ? 'Engaging' : 'Needs Improvement',
        leadership: hasLeadership ? 'Demonstrated' : 'Not Evident',
        problemSolving: hasProblemSolving ? 'Strong' : 'Needs More Detail',
        strengths: [
            ...(hasStorytelling ? ['Good storytelling structure (STAR method)'] : []),
            ...(hasLeadership ? ['Leadership qualities demonstrated'] : []),
            ...(hasProblemSolving ? ['Problem-solving approach shown'] : [])
        ],
        improvements: [
            ...(!hasStorytelling ? ['Use the STAR method (Situation, Task, Action, Result)'] : []),
            ...(!hasLeadership ? ['Highlight leadership or ownership'] : []),
            ...(!hasProblemSolving ? ['Show your problem-solving process'] : [])
        ]
    };
}

function BehavioralInterview() {
    const [currentQ, setCurrentQ] = useState(0);
    const [answer, setAnswer] = useState('');
    const [results, setResults] = useState([]);
    const [showFeedback, setShowFeedback] = useState(false);
    const [currentFeedback, setCurrentFeedback] = useState(null);
    const [completed, setCompleted] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [isSetupComplete, setIsSetupComplete] = useState(false);

    const saveToDatabase = async (allResults) => {
        try {
            const duration = Math.round((Date.now() - startTime) / 1000);
            const avg = allResults.reduce((s, r) => s + r.feedback.score, 0) / allResults.length;
            await API.post('/interview/save', {
                type: 'behavioral',
                questions: allResults.map(r => ({ question: r.question, userAnswer: r.answer, score: r.feedback.score * 10, strengths: r.feedback.strengths, improvements: r.feedback.improvements })),
                overallScore: Math.round(avg * 10), totalQuestions: allResults.length, duration
            });
        } catch (err) { console.error('Save failed:', err); }
    };

    const handleSubmit = () => {
        if (!answer.trim()) return;
        const feedback = evaluateAnswer(answer);
        setResults([...results, { question: behavioralQuestions[currentQ], answer, feedback }]);
        setCurrentFeedback(feedback);
        setShowFeedback(true);
    };

    const handleNext = () => {
        setAnswer(''); setShowFeedback(false); setCurrentFeedback(null);
        if (currentQ + 1 >= behavioralQuestions.length) { setCompleted(true); saveToDatabase([...results]); }
        else setCurrentQ(currentQ + 1);
    };

    const avgScore = results.length > 0 ? (results.reduce((s, r) => s + r.feedback.score, 0) / results.length).toFixed(1) : 0;

    if (!isSetupComplete) {
        return (
            <InterviewSetup
                title="Behavioral Interview"
                description="Practice answering behavioral questions to demonstrate your soft skills, leadership, and emotional intelligence."
                requirements={[
                    "A quiet environment to focus on storytelling",
                    "Clear microphone and camera recommended (though optional for this text-based practice)",
                    "Stable internet connection"
                ]}
                tips={[
                    "Always use the STAR format: Situation, Task, Action, and Result.",
                    "Focus on 'I' rather than 'We' when describing the Action.",
                    "Be honest about failures and emphasize what you learned.",
                    "Keep your stories concise and relevant to the role."
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
                    <h2>Behavioral Interview Completed!</h2>
                    <div className="final-score"><span className="big-score">{avgScore}</span><span className="score-label">/10 Average</span></div>
                    <div className="results-summary">
                        {results.map((r, i) => (
                            <div className="result-item" key={i}>
                                <span className="result-q">Q{i + 1}: {r.question.substring(0, 50)}...</span>
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
                <h2 className="text-4xl font-semibold text-white uppercase">Behavioral Interview</h2>
                <div className="progress-info">
                    <span className="text-white font-medium">Question {currentQ + 1} of {behavioralQuestions.length}</span>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${((currentQ + 1) / behavioralQuestions.length) * 100}%` }}></div></div>
                </div>
            </div>
            <div className="question-card glass-card"><span className="q-number">Q{currentQ + 1}</span><h3>{behavioralQuestions[currentQ]}</h3></div>
            {!showFeedback ? (
                <div className="answer-section">
                    <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Use the STAR method: Situation, Task, Action, Result..." rows={6} />
                    <button className="btn btn-primary" onClick={handleSubmit} disabled={!answer.trim()}>Submit Answer</button>
                </div>
            ) : (
                <div className="feedback-card glass-card">
                    <div className="feedback-header"><h3>AI Feedback</h3><span className={`feedback-score ${currentFeedback.score >= 7 ? 'high' : currentFeedback.score >= 5 ? 'medium' : 'low'}`}>Score: {currentFeedback.score}/10</span></div>
                    <div className="feedback-metrics">
                        <div className="metric">Storytelling: {currentFeedback.storytelling}</div>
                        <div className="metric">Leadership: {currentFeedback.leadership}</div>
                        <div className="metric">Problem Solving: {currentFeedback.problemSolving}</div>
                    </div>
                    <div className="feedback-section"><h4>Strengths</h4><ul>{currentFeedback.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
                    <div className="feedback-section"><h4>Improve</h4><ul>{currentFeedback.improvements.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
                    <button className="btn btn-primary" onClick={handleNext}>{currentQ + 1 >= behavioralQuestions.length ? 'View Results' : 'Next Question →'}</button>
                </div>
            )}
        </div>
    );
}

export default BehavioralInterview;
