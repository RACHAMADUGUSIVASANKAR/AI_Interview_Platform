import React, { useState, useEffect, useRef } from 'react';
import { API } from '../../../context/AuthContext';
import InterviewSetup from './InterviewSetup';

const gdTopics = [
    "Is AI a threat to human jobs?",
    "Should social media be regulated?",
    "Work from home vs Office work",
    "Is technology making us less social?",
    "Online learning vs Classroom learning",
    "Should coding be mandatory in schools?",
    "Is privacy more important than security?",
    "Can startups replace big corporations?",
    "Is cryptocurrency the future of money?",
    "Should college education be free?"
];

const aiParticipants = [
    { name: 'AI Participant 2', avatar: 'P2' },
    { name: 'AI Participant 3', avatar: 'P3' }
];

const generateAIResponse = (topic, participantIndex) => {
    const responses = {
        0: [
            `I think this is a very important topic. ${topic} — we need to consider multiple perspectives here.`,
            `From a practical standpoint, there are clear advantages and disadvantages. Let me explain my viewpoint.`,
            `I partially agree with the previous points. However, we should also consider the impact on society as a whole.`,
            `Statistics show that trends are changing rapidly. We need to adapt our thinking accordingly.`,
            `Building on what was said, I believe innovation and regulation should go hand in hand.`
        ],
        1: [
            `That's an interesting perspective. I'd like to add that ${topic} has both short-term and long-term implications.`,
            `I respectfully disagree with some points. The evidence suggests a more nuanced view is needed.`,
            `From a global perspective, different regions are handling this differently. We can learn from various approaches.`,
            `I think the key issue here is balance. We shouldn't go to extremes on either side.`,
            `To summarize the discussion so far, there are valid points on both sides. The real question is implementation.`
        ]
    };
    const pool = responses[participantIndex] || responses[0];
    return pool[Math.floor(Math.random() * pool.length)];
};

function GroupDiscussion() {
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [timeLeft, setTimeLeft] = useState(180);
    const [showResult, setShowResult] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [isSetupComplete, setIsSetupComplete] = useState(false);
    const timerRef = useRef(null);
    const chatRef = useRef(null);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((t) => {
                    if (t <= 1) {
                        clearInterval(timerRef.current);
                        setIsActive(false);
                        setShowResult(true);
                        return 0;
                    }
                    return t - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [isActive]);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    const startDiscussion = (topic) => {
        setSelectedTopic(topic);
        setTimeLeft(180);
        setMessages([
            { sender: aiParticipants[0].name, avatar: aiParticipants[0].avatar, text: `Let's discuss: "${topic}". ${generateAIResponse(topic, 0)}`, time: '0:00' }
        ]);
        setIsActive(true);
        setShowResult(false);
    };

    const sendMessage = () => {
        if (!userInput.trim() || !isActive) return;
        const elapsed = 180 - timeLeft;
        const mins = Math.floor(elapsed / 60);
        const secs = (elapsed % 60).toString().padStart(2, '0');
        const timeStr = `${mins}:${secs}`;

        const newMessages = [
            ...messages,
            { sender: 'You', avatar: 'Me', text: userInput, time: timeStr, isUser: true }
        ];

        // AI responses after user speaks
        setTimeout(() => {
            const aiIdx = Math.floor(Math.random() * 2);
            const aiResponse = {
                sender: aiParticipants[aiIdx].name,
                avatar: aiParticipants[aiIdx].avatar,
                text: generateAIResponse(selectedTopic, aiIdx),
                time: timeStr
            };
            setMessages(prev => [...prev, aiResponse]);
        }, 1500);

        setMessages(newMessages);
        setUserInput('');
    };

    const userMessages = messages.filter(m => m.isUser);
    const evaluate = () => {
        const participation = userMessages.length;
        const totalWords = userMessages.reduce((sum, m) => sum + m.text.split(/\s+/).length, 0);
        return {
            participation: participation > 5 ? 'Excellent' : participation > 3 ? 'Good' : 'Low',
            clarity: totalWords > 50 ? 'Clear' : 'Needs More Input',
            score: Math.min(10, Math.round((participation * 1.5 + totalWords / 20) * 10) / 10),
            totalInputs: participation,
            totalWords
        };
    };

    const saveGD = async () => {
        try {
            const result = evaluate();
            await API.post('/interview/save', {
                type: 'group-discussion', role: selectedTopic,
                questions: userMessages.map(m => ({ question: selectedTopic, userAnswer: m.text, score: result.score * 10 })),
                overallScore: Math.round(result.score * 10), totalQuestions: userMessages.length, duration: 180 - timeLeft
            });
        } catch (err) { console.error('Save failed:', err); }
    };

    if (!isSetupComplete) {
        return (
            <InterviewSetup
                title="Group Discussion Simulation"
                description="Simulate a real-world Group Discussion with AI participants. Practice articulating your points clearly and responding to counter-arguments."
                requirements={[
                    "A quiet environment to focus on the chat stream",
                    "Quick reading and typing skills to keep up with the pace"
                ]}
                tips={[
                    "Don't just agree or disagree; provide reasoning and evidence for your stance.",
                    "Acknowledge other participants' points before making your own.",
                    "Keep your inputs concise but impactful (2-3 sentences per message).",
                    "Try to steer the conversation back on track if it deviates."
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
                <h1 className="text-4xl font-semibold text-white uppercase mb-4">Group Discussion</h1>
                <p className="page-subtitle text-xl text-white font-normal mb-12">You + 2 AI participants. Choose a topic to start.</p>
                <div className="topics-grid">
                    {gdTopics.map((topic, i) => (
                        <button key={i} className="topic-card" onClick={() => startDiscussion(topic)}>

                            <span>{topic}</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    if (showResult) {
        const result = evaluate();
        return (
            <div className="interview-module">
                <div className="feedback-card glass-card">
                    <h2>GD Results</h2>
                    <h3>Topic: {selectedTopic}</h3>
                    <div className="feedback-header">
                        <span className={`feedback-score ${result.score >= 7 ? 'high' : result.score >= 5 ? 'medium' : 'low'}`}>Score: {result.score}/10</span>
                    </div>
                    <div className="feedback-metrics">
                        <div className="metric">Participation: {result.participation}</div>
                        <div className="metric">Clarity: {result.clarity}</div>
                        <div className="metric">Your Inputs: {result.totalInputs}</div>
                        <div className="metric">Total Words: {result.totalWords}</div>
                    </div>
                    <button className="btn btn-primary" onClick={() => { setSelectedTopic(null); setShowResult(false); saveGD(); }}>Try Another Topic</button>
                </div>
            </div>
        );
    }

    return (
        <div className="interview-module">
            <div className="interview-header">
                <h2 className="text-4xl font-semibold text-white uppercase">Group Discussion</h2>
                <div className="timer-display">
                    <span className={`timer ${timeLeft <= 30 ? 'critical' : ''}`}>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                </div>
            </div>

            <div className="gd-chat" ref={chatRef}>
                {messages.map((msg, i) => (
                    <div key={i} className={`gd-message ${msg.isUser ? 'user-msg' : 'ai-msg'}`}>
                        <span className="msg-avatar">{msg.avatar}</span>
                        <div className="msg-content">
                            <span className="msg-sender">{msg.sender} <small>{msg.time}</small></span>
                            <p>{msg.text}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="gd-input">
                <input
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your point... (press Enter to send)"
                    disabled={!isActive}
                />
                <button className="btn btn-primary" onClick={sendMessage} disabled={!isActive || !userInput.trim()}>Send</button>
                <button className="btn btn-outline" onClick={() => { clearInterval(timerRef.current); setIsActive(false); setShowResult(true); }}>End Discussion</button>
            </div>
        </div>
    );
}

export default GroupDiscussion;
