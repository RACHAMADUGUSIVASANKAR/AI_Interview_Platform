import React, { useState, useEffect, useRef } from 'react';
import { API } from '../../../context/AuthContext';
import InterviewSetup from './InterviewSetup';

const topics = [
    "Artificial Intelligence", "Climate Change", "Social Media Impact", "Space Exploration",
    "Electric Vehicles", "Remote Work Culture", "Online Education", "Cryptocurrency",
    "Mental Health Awareness", "Renewable Energy", "5G Technology", "Startups vs Corporates",
    "Data Privacy", "Women in Tech", "Future of Healthcare"
];

function JAMSession() {
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [transcript, setTranscript] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [isSetupComplete, setIsSetupComplete] = useState(false);
    const [speechSupported, setSpeechSupported] = useState(true);
    const timerRef = useRef(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) setSpeechSupported(false);

        if (isRecording && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((t) => {
                    if (t <= 1) {
                        clearInterval(timerRef.current);
                        setIsRecording(false);
                        setShowResult(true);
                        return 0;
                    }
                    return t - 1;
                });
            }, 1000);
        }
        return () => {
            clearInterval(timerRef.current);
            stopListening();
        };
    }, [isRecording]);

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
        };

        recognition.onend = () => {
            if (isRecording) {
                try { recognition.start(); } catch (e) { }
            }
        };

        try {
            recognition.start();
            recognitionRef.current = recognition;
        } catch (e) {
            console.error('Failed to start recognition:', e);
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch (e) { }
            recognitionRef.current = null;
        }
    };

    const startSession = (topic) => {
        setSelectedTopic(topic);
        setTimeLeft(60);
        setTranscript('');
        setShowResult(false);
        setIsRecording(true);
        startListening();
    };

    const stopSession = () => {
        clearInterval(timerRef.current);
        setIsRecording(false);
        stopListening();
        setShowResult(true);
        saveToDatabase(transcript, selectedTopic);
    };

    const saveToDatabase = async (text, topic) => {
        try {
            const wordCount = text.trim().split(/\s+/).filter(w => w).length;
            const score = Math.min(100, Math.round((wordCount / 15) * 100));
            await API.post('/interview/save', {
                type: 'jam', role: topic,
                questions: [{ question: topic, userAnswer: text, score }],
                overallScore: score, totalQuestions: 1, duration: 60 - timeLeft
            });
        } catch (err) { console.error('Save failed:', err); }
    };

    const evaluateSpeech = () => {
        const text = transcript;
        const wordCount = text.trim().split(/\s+/).filter(w => w).length;
        const uniqueWords = new Set(text.toLowerCase().split(/\s+/)).size;
        const wordsPerMin = wordCount;

        return {
            fluency: wordsPerMin > 100 ? 'Excellent' : wordsPerMin > 60 ? 'Good' : 'Needs Practice',
            confidence: wordCount > 80 ? 'High' : wordCount > 40 ? 'Moderate' : 'Low',
            vocabulary: uniqueWords > 50 ? 'Rich' : uniqueWords > 25 ? 'Average' : 'Limited',
            speed: `${wordsPerMin} words/min`,
            score: Math.min(10, Math.round((wordCount / 15) * 10) / 10),
            wordCount
        };
    };

    if (!isSetupComplete) {
        return (
            <InterviewSetup
                title="JAM Session"
                description="Just A Minute (JAM) is a fast-paced test of your spoken English, fluency, and presence of mind. Speak on a random topic for 60 seconds."
                requirements={[
                    "A working microphone is required",
                    "A quiet room to minimize background noise",
                    "A clear head and readiness to speak continuously"
                ]}
                tips={[
                    "Don't stop speaking; fluency is key.",
                    "Avoid repeating the same sentences or ideas.",
                    "If you get stuck, approach the topic from a different angle (past, present, future).",
                    "Keep your vocabulary rich but natural."
                ]}
                onStart={() => {
                    setStartTime(Date.now());
                    setIsSetupComplete(true);
                }}
            />
        );
    }

    if (!selectedTopic) {
        return (
            <div className="interview-module">
                <h1 className="text-4xl font-semibold text-white uppercase mb-4">JAM Session</h1>
                <p className="page-subtitle text-xl text-white font-normal mb-12">Just A Minute - Choose a topic and speak for 1 minute.</p>
                {!speechSupported && (
                    <div className="warning-text" style={{ marginBottom: '1rem', color: '#ff4d4f' }}>
                        Speech Recognition is not supported in this browser. Please use Chrome or Edge.
                    </div>
                )}
                <div className="topics-grid">
                    {topics.map((topic, i) => (
                        <button key={i} className="topic-card glass-card" onClick={() => startSession(topic)}>
                            <span>{topic}</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    const result = showResult ? evaluateSpeech() : null;

    return (
        <div className="interview-module">
            <div className="interview-header">
                <h2 className="text-4xl font-semibold text-white uppercase">JAM Session</h2>
                <div className="timer-display">
                    <span className={`timer ${timeLeft <= 10 ? 'critical' : ''}`}>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                </div>
            </div>

            <div className="jam-topic-card">
                <h3>Topic: {selectedTopic}</h3>
                <p>Speak clearly about this topic. Go!</p>
            </div>

            {isRecording && (
                <div className="jam-recording">
                    <div className="recording-indicator">
                        <span className="pulse-dot"></span> Listening... speak now
                    </div>
                    <div className="transcript-display glass-card" style={{ minHeight: '150px', textAlign: 'left', marginTop: '20px' }}>
                        <p className={transcript ? '' : 'placeholder-text'} style={{ fontSize: '1.2rem', lineHeight: '1.6' }}>
                            {transcript || 'Your spoken words will appear here...'}
                        </p>
                    </div>
                    <button className="btn btn-primary" onClick={stopSession} style={{ marginTop: '20px' }}>Stop & Submit</button>
                </div>
            )}

            {showResult && result && (
                <div className="feedback-card glass-card">
                    <div className="feedback-header">
                        <h3>AI Evaluation</h3>
                        <span className={`feedback-score ${result.score >= 7 ? 'high' : result.score >= 5 ? 'medium' : 'low'}`}>Score: {result.score}/10</span>
                    </div>
                    <div className="feedback-metrics">
                        <div className="metric">Fluency: {result.fluency}</div>
                        <div className="metric">Confidence: {result.confidence}</div>
                        <div className="metric">Vocabulary: {result.vocabulary}</div>
                        <div className="metric">Speed: {result.speed}</div>
                        <div className="metric">Word Count: {result.wordCount}</div>
                    </div>
                    <div className="result-actions">
                        <button className="btn btn-primary" onClick={() => { setSelectedTopic(null); setShowResult(false); }}>Try Another Topic</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default JAMSession;
