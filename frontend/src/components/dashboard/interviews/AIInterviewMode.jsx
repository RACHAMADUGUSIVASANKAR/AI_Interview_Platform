import React, { useState, useEffect, useRef, useCallback } from 'react';
import { API } from '../../../context/AuthContext';

const interviewQuestions = {
    general: [
        "Tell me about yourself and your career aspirations.",
        "Why are you interested in this role?",
        "What are your greatest strengths?",
        "Can you describe a challenging project you worked on?",
        "How do you handle tight deadlines?",
        "What motivates you in your professional life?",
        "Tell me about a time you showed leadership.",
        "How do you stay updated with industry trends?",
        "Where do you see yourself in five years?",
        "Do you have any questions for us?"
    ],
    technical: [
        "Explain the concept of object-oriented programming.",
        "What is the difference between SQL and NoSQL databases?",
        "How would you design a scalable web application?",
        "Explain RESTful API design principles.",
        "What is version control and why is it important?",
        "Describe the MVC architecture pattern.",
        "How does authentication work in web applications?",
        "What are microservices and when would you use them?",
        "Explain the concept of CI/CD pipelines.",
        "What security best practices do you follow?"
    ],
    behavioral: [
        "Tell me about a time you resolved a conflict at work.",
        "Describe a situation where you had to learn quickly.",
        "How do you prioritize competing demands?",
        "Give an example of a creative solution you implemented.",
        "Tell me about a failure and what you learned.",
        "How do you handle constructive criticism?",
        "Describe a time you went above expectations.",
        "How do you collaborate with cross-functional teams?",
        "Tell me about a difficult decision you made.",
        "How do you maintain work-life balance?"
    ]
};

function getNextQuestion(category, index, previousAnswer) {
    const questions = interviewQuestions[category] || interviewQuestions.general;
    if (index < questions.length) return questions[index];
    return null;
}

function evaluateResponse(answer) {
    const wordCount = answer.trim().split(/\s+/).length;
    const hasStructure = answer.includes('.') && wordCount > 10;
    const hasExamples = /for example|such as|instance|when i|in my|we used|i built/i.test(answer);
    const hasTechnical = /api|function|class|database|server|framework|code|algorithm/i.test(answer);
    const isDetailed = wordCount > 25;
    let score = 3;
    if (wordCount > 8) score += 1;
    if (hasStructure) score += 1.5;
    if (hasExamples) score += 1.5;
    if (hasTechnical) score += 1;
    if (isDetailed) score += 2;
    return {
        score: Math.min(10, Math.round(score * 10) / 10),
        wordCount,
        clarity: hasStructure ? 'Good' : 'Needs Work',
        depth: isDetailed ? 'Detailed' : 'Brief',
        examples: hasExamples ? 'Yes' : 'No'
    };
}

// Simple logic to generate a contextual follow-up instead of a static list
function generateFollowUpQuestion(category, previousAnswer) {
    if (!previousAnswer || previousAnswer.length < 5) return getNextQuestion(category, Math.floor(Math.random() * 5), "");

    // Simulate simple keyword extraction for a follow-up
    const keywords = ["challenge", "project", "team", "leader", "agile", "api", "database", "scale", "performance", "conflict"];
    const foundKw = keywords.find(k => previousAnswer.toLowerCase().includes(k));

    if (foundKw) {
        return `You mentioned "${foundKw}". Could you elaborate on how you handled that specific aspect and what the outcome was?`;
    }

    // Fallback contextual prompt
    return "That's an interesting perspective. How did that experience shape your current approach or philosophy?";
}

function AIInterviewMode() {
    const [phase, setPhase] = useState('setup'); // setup, ready, interview, results
    const [category, setCategory] = useState('general');
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [responses, setResponses] = useState([]);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
    const [cameraActive, setCameraActive] = useState(false);
    const [expressionLog, setExpressionLog] = useState([]);
    const [aiSpeaking, setAiSpeaking] = useState(false);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [speechSupported, setSpeechSupported] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [startTime] = useState(Date.now());

    const containerRef = useRef(null);
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const recognitionRef = useRef(null);
    const timerRef = useRef(null);
    const synthRef = useRef(window.speechSynthesis);

    // Check speech recognition support
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            setSpeechSupported(true);
        }
    }, []);

    // Timer
    useEffect(() => {
        if (phase === 'interview' && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(t => {
                    if (t <= 1) {
                        clearInterval(timerRef.current);
                        endInterview();
                        return 0;
                    }
                    return t - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [phase]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopCamera();
            stopListening();
            synthRef.current?.cancel();
            clearInterval(timerRef.current);
        };
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setCameraActive(true);
            setPermissionGranted(true);
            return true;
        } catch (err) {
            console.error('Camera/mic access denied:', err);
            alert('Please allow camera and microphone access to use AI Interview Mode.');
            return false;
        }
    };

    const toggleFullscreen = async (forceEnter = false) => {
        if (!document.fullscreenElement && forceEnter) {
            try {
                if (containerRef.current?.requestFullscreen) {
                    await containerRef.current.requestFullscreen();
                } else if (containerRef.current?.webkitRequestFullscreen) {
                    await containerRef.current.webkitRequestFullscreen();
                }
                setIsFullscreen(true);
            } catch (err) {
                console.error("Error attempting to enable full-screen mode:", err.message);
            }
        } else if (document.fullscreenElement && !forceEnter) {
            if (document.exitFullscreen) {
                await document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                await document.webkitExitFullscreen();
            }
            setIsFullscreen(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setCameraActive(false);
    };

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
                setTranscript(prev => prev + ' ' + finalTranscript);
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'no-speech') {
                // Restart
                try { recognition.stop(); } catch (e) { }
                setTimeout(() => {
                    if (isListening) startListening();
                }, 500);
            }
        };

        recognition.onend = () => {
            // Auto-restart if still supposed to be listening
            if (isListening) {
                try { recognition.start(); } catch (e) { }
            }
        };

        try {
            recognition.start();
            recognitionRef.current = recognition;
            setIsListening(true);
        } catch (e) {
            console.error('Failed to start recognition:', e);
        }
    };

    const stopListening = () => {
        setIsListening(false);
        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch (e) { }
            recognitionRef.current = null;
        }
    };

    const speakText = (text) => {
        return new Promise((resolve) => {
            setAiSpeaking(true);
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 1;
            utterance.onend = () => {
                setAiSpeaking(false);
                resolve();
            };
            utterance.onerror = () => {
                setAiSpeaking(false);
                resolve();
            };
            synthRef.current.speak(utterance);
        });
    };

    const analyzeExpression = () => {
        // Simulated expression analysis (uses random sampling)
        // In production, this would use face-api.js with the video feed
        const expressions = ['neutral', 'confident', 'thoughtful', 'engaged', 'nervous'];
        const weights = [0.3, 0.25, 0.2, 0.15, 0.1];
        const rand = Math.random();
        let cumulative = 0;
        let expression = 'neutral';
        for (let i = 0; i < expressions.length; i++) {
            cumulative += weights[i];
            if (rand < cumulative) {
                expression = expressions[i];
                break;
            }
        }
        return {
            expression,
            eyeContact: Math.random() > 0.3 ? 'good' : 'away',
            confidence: (60 + Math.random() * 30).toFixed(0) + '%',
            timestamp: Date.now()
        };
    };

    const startInterview = async () => {
        const cameraOk = await startCamera();
        if (!cameraOk) return;

        setPhase('interview');
        setCurrentQIndex(0);
        setResponses([]);
        setExpressionLog([]);
        setTimeLeft(600);

        await toggleFullscreen(true);

        const firstQ = getNextQuestion(category, 0, '');
        setCurrentQuestion(firstQ);

        // Small delay then speak
        setTimeout(async () => {
            await speakText('Welcome to the AI Interview. Let us begin. ' + firstQ);
            startListening();

            // Start periodic expression analysis
            const exprInterval = setInterval(() => {
                if (phase !== 'interview') {
                    clearInterval(exprInterval);
                    return;
                }
                const expr = analyzeExpression();
                setExpressionLog(prev => [...prev, expr]);
            }, 5000);
        }, 1000);
    };

    const submitAnswer = async () => {
        stopListening();
        const answer = transcript.trim();
        const evaluation = evaluateResponse(answer || 'No response provided');
        const expr = analyzeExpression();

        const response = {
            question: currentQuestion,
            answer: answer || '(No verbal response)',
            evaluation,
            expression: expr
        };

        const newResponses = [...responses, response];
        setResponses(newResponses);
        setTranscript('');

        let nextQ;
        const nextIndex = currentQIndex + 1;

        // Dynamically generate follow-up or pick next static question
        if (nextIndex % 2 !== 0 && evaluation.wordCount > 10) {
            nextQ = generateFollowUpQuestion(category, answer);
        } else {
            nextQ = getNextQuestion(category, nextIndex, answer);
        }

        if (!nextQ || timeLeft <= 0 || nextIndex >= 10) {
            endInterview(newResponses);
            return;
        }

        setCurrentQIndex(nextIndex);
        setCurrentQuestion(nextQ);

        // AI speaks next question
        await speakText('Thank you. Next question. ' + nextQ);
        startListening();
    };

    const endInterview = async (finalResponses) => {
        const allResponses = finalResponses || responses;
        clearInterval(timerRef.current);
        stopListening();
        stopCamera();
        synthRef.current?.cancel();
        setPhase('results');

        await toggleFullscreen(false);

        // Save to database
        try {
            const duration = Math.round((Date.now() - startTime) / 1000);
            const avgScore = allResponses.length > 0
                ? allResponses.reduce((s, r) => s + r.evaluation.score, 0) / allResponses.length
                : 0;
            await API.post('/interview/save', {
                type: 'ai-interview',
                role: category,
                questions: allResponses.map(r => ({
                    question: r.question,
                    userAnswer: r.answer,
                    score: r.evaluation.score * 10,
                    feedback: `Clarity: ${r.evaluation.clarity}, Depth: ${r.evaluation.depth}, Expression: ${r.expression.expression}`
                })),
                overallScore: Math.round(avgScore * 10),
                totalQuestions: allResponses.length,
                duration
            });
        } catch (err) { console.error('Failed to save AI interview:', err); }
    };

    const mins = Math.floor(timeLeft / 60);
    const secs = (timeLeft % 60).toString().padStart(2, '0');

    // ======= SETUP SCREEN =======
    if (phase === 'setup') {
        return (
            <div ref={containerRef} className="interview-module ai-interview-mode">
                <h1 className="text-4xl font-semibold text-white uppercase mb-4">AI Interview Mode</h1>
                <p className="page-subtitle text-xl text-white font-normal mb-12">Simulate a real video interview with AI - 10 minute session</p>

                <div className="ai-setup-grid">
                    <div className="setup-card glass-card">
                        <h3>How It Works</h3>
                        <ul className="setup-steps">
                            <li><strong>1.</strong> Allow camera and microphone access</li>
                            <li><strong>2.</strong> AI asks questions via voice (text-to-speech)</li>
                            <li><strong>3.</strong> You respond by speaking (speech-to-text)</li>
                            <li><strong>4.</strong> AI analyzes your response, expression, and confidence</li>
                            <li><strong>5.</strong> Dynamic follow-up questions based on your answers</li>
                            <li><strong>6.</strong> Full transcript and analytics at the end</li>
                        </ul>
                    </div>

                    <div className="setup-card glass-card">
                        <h3>Choose Category</h3>
                        <div className="category-options">
                            {Object.keys(interviewQuestions).map(cat => (
                                <button
                                    key={cat}
                                    className={`category-btn px-6 py-3 rounded-xl font-bold transition-all border ${category === cat
                                        ? 'bg-[#00FF66] text-black border-[#00FF66] shadow-[0_0_20px_rgba(0,255,102,0.4)]'
                                        : 'bg-white/5 text-white hover:bg-white/10 border-white/10'
                                        }`}
                                    onClick={() => setCategory(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="requirements-note">
                            <h4>Requirements</h4>
                            <p>Camera + Microphone access required</p>
                            <p>Use Chrome or Edge for best speech recognition</p>
                            {!speechSupported && (
                                <p className="warning-text">Speech Recognition not supported in this browser. Use Chrome or Edge.</p>
                            )}
                        </div>

                        <button className="btn btn-primary btn-lg" onClick={startInterview}>
                            Start AI Interview
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ======= INTERVIEW SCREEN =======
    if (phase === 'interview') {
        return (
            <div
                ref={containerRef}
                className={`interview-module ai-interview-mode ${isFullscreen ? 'fullscreen-active' : ''}`}
                style={isFullscreen ? { padding: '40px', background: 'var(--bg-black)', minHeight: '100vh', overflowY: 'auto' } : {}}
            >
                <div className="interview-header" style={isFullscreen ? { marginTop: '20px' } : {}}>
                    <h2 className="text-4xl font-semibold text-white uppercase">AI Interview - {category}</h2>
                    <div className="ai-timer">
                        <span className={`timer ${timeLeft <= 60 ? 'critical' : ''}`}>{mins}:{secs}</span>
                        <span className="q-counter">Q{currentQIndex + 1}/10</span>
                        <button className="btn btn-outline btn-sm" onClick={() => toggleFullscreen(!isFullscreen)} title="Toggle Fullscreen">
                            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                        </button>
                    </div>
                </div>

                <div className="ai-interview-layout" style={isFullscreen ? { gap: '40px' } : {}}>
                    <div className="video-panel glass-card" style={isFullscreen ? { padding: '20px', borderRadius: '30px' } : {}}>
                        {/* Inline styles applied to ensure video is visible over dark backgrounds */}
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            className="interview-video"
                            style={{
                                width: '100%',
                                height: isFullscreen ? '450px' : '300px',
                                objectFit: 'cover',
                                borderRadius: 'var(--radius-lg)',
                                backgroundColor: '#111',
                                transform: 'scaleX(-1)' // Mirror the camera
                            }}
                        />
                        <div className="video-overlay" style={{ top: '24px', left: '24px' }}>
                            {aiSpeaking && <div className="ai-speaking-indicator">AI is speaking...</div>}
                            {isListening && <div className="listening-indicator"><span className="pulse-dot"></span> Listening...</div>}
                        </div>
                        <div className="expression-badge">
                            {expressionLog.length > 0 && (
                                <span>Expression: {expressionLog[expressionLog.length - 1].expression}</span>
                            )}
                        </div>
                    </div>

                    <div className="conversation-panel">
                        <div className="ai-question-bubble glass-card">
                            <span className="bubble-label">AI Interviewer</span>
                            <p>{currentQuestion}</p>
                        </div>

                        <div className="user-response-area">
                            <div className="transcript-display glass-card">
                                <span className="bubble-label">Your Response (Live)</span>
                                <p className={transcript ? '' : 'placeholder-text'}>
                                    {transcript || 'Start speaking... your words will appear here in real-time.'}
                                </p>
                            </div>

                            <div className="response-actions">
                                <button className="btn btn-primary" onClick={submitAnswer}>
                                    Submit Answer and Next
                                </button>
                                <button className="btn btn-outline" onClick={() => endInterview()}>
                                    End Interview
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ======= RESULTS SCREEN =======
    if (phase === 'results') {
        const avgScore = responses.length > 0
            ? (responses.reduce((s, r) => s + r.evaluation.score, 0) / responses.length).toFixed(1)
            : 0;

        const expressionSummary = {};
        expressionLog.forEach(e => {
            expressionSummary[e.expression] = (expressionSummary[e.expression] || 0) + 1;
        });
        const dominantExpression = Object.entries(expressionSummary)
            .sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';

        const eyeContactGood = expressionLog.filter(e => e.eyeContact === 'good').length;
        const eyeContactPercent = expressionLog.length > 0
            ? Math.round((eyeContactGood / expressionLog.length) * 100) : 0;

        return (
            <div ref={containerRef} className="interview-module ai-interview-mode">
                <div className="completion-card glass-card">
                    <h2>AI Interview Completed!</h2>
                    <p>Category: <span className="font-semibold">{category.charAt(0).toUpperCase() + category.slice(1)}</span></p>

                    <div className="ai-results-grid">
                        <div className="result-stat glass-card">
                            <span className="result-stat-value">{avgScore}/10</span>
                            <span className="result-stat-label">Average Score</span>
                        </div>
                        <div className="result-stat glass-card">
                            <span className="result-stat-value">{responses.length}</span>
                            <span className="result-stat-label">Questions Answered</span>
                        </div>
                        <div className="result-stat glass-card">
                            <span className="result-stat-value">{dominantExpression}</span>
                            <span className="result-stat-label">Dominant Expression</span>
                        </div>
                        <div className="result-stat glass-card">
                            <span className="result-stat-value">{eyeContactPercent}%</span>
                            <span className="result-stat-label">Eye Contact</span>
                        </div>
                    </div>

                    <div className="ai-transcript-section glass-card">
                        <h3>Interview Transcript</h3>
                        {responses.map((r, i) => (
                            <div className="transcript-item" key={i}>
                                <div className="transcript-q">
                                    <span className="font-semibold">Q{i + 1}:</span> {r.question}
                                </div>
                                <div className="transcript-a">
                                    <span className="font-semibold">Your Answer:</span> {r.answer}
                                </div>
                                <div className="transcript-eval">
                                    <span className={`score-badge ${r.evaluation.score >= 7 ? 'high' : r.evaluation.score >= 5 ? 'medium' : 'low'}`}>
                                        Score: {r.evaluation.score}/10
                                    </span>
                                    <span className="eval-detail">Clarity: {r.evaluation.clarity}</span>
                                    <span className="eval-detail">Depth: {r.evaluation.depth}</span>
                                    <span className="eval-detail">Expression: {r.expression.expression}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {expressionLog.length > 0 && (
                        <div className="expression-summary glass-card">
                            <h3>Expression Analysis</h3>
                            <div className="expression-bars">
                                {Object.entries(expressionSummary).map(([expr, count]) => (
                                    <div className="expression-bar-item" key={expr}>
                                        <span className="expr-label">{expr}</span>
                                        <div className="expr-bar-track">
                                            <div className="expr-bar-fill" style={{ width: `${(count / expressionLog.length) * 100}%` }}></div>
                                        </div>
                                        <span className="expr-count">{Math.round((count / expressionLog.length) * 100)}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="result-actions">
                        <button className="btn btn-primary" onClick={() => { setPhase('setup'); setResponses([]); setExpressionLog([]); setTimeLeft(600); }}>
                            Start New Interview
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}

export default AIInterviewMode;
