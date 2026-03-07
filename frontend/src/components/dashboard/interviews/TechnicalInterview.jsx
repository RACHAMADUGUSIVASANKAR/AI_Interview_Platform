import React, { useState } from 'react';
import { API } from '../../../context/AuthContext';
import InterviewSetup from './InterviewSetup';

const roles = {
    'Java Developer': [
        "Explain OOP principles with examples.", "What is the difference between abstract class and interface?",
        "Explain multithreading in Java.", "What are Java collections? Name the key interfaces.",
        "What is the JVM and how does it work?", "Explain exception handling in Java.",
        "What are generics in Java?", "Explain the difference between HashMap and TreeMap.",
        "What is garbage collection?", "Explain design patterns you have used.",
        "What is the difference between == and .equals()?", "Explain the Java memory model.",
        "What are lambda expressions?", "Explain the Stream API.",
        "What is dependency injection?", "Explain SOLID principles.",
        "What are annotations in Java?", "Explain serialization and deserialization.",
        "What is a thread pool?", "How does the synchronized keyword work?"
    ],
    'Web Developer': [
        "Explain the box model in CSS.", "What is the difference between let, var, and const?",
        "How does the DOM work?", "Explain REST APIs and HTTP methods.",
        "What is responsive design?", "Explain the event loop in JavaScript.",
        "What are closures?", "What is CORS and how do you handle it?",
        "Explain CSS Flexbox vs Grid.", "What is the Virtual DOM in React?",
        "How does state management work in React?", "What is webpack and why is it used?",
        "Explain async/await in JavaScript.", "What are web sockets?",
        "What is progressive web app?", "Explain CSS specificity.",
        "What are service workers?", "How does browser rendering work?",
        "What is cross-site scripting (XSS)?", "Explain local storage vs session storage."
    ],
    'Python Developer': [
        "What are Python decorators?", "Explain list comprehensions.",
        "What is the GIL in Python?", "How does memory management work?",
        "What are generators?", "Explain *args and **kwargs.",
        "What is the difference between a list and a tuple?", "Explain Django vs Flask.",
        "What are context managers?", "How does Python handle multithreading?",
        "What are metaclasses?", "Explain Python's garbage collection.",
        "What is duck typing?", "Explain virtual environments.",
        "What are Python modules and packages?", "Explain map, filter, reduce.",
        "What is PEP 8?", "How does inheritance work in Python?",
        "What are dataclasses?", "Explain Python's asyncio."
    ],
    'Data Scientist': [
        "Explain supervised vs unsupervised learning.", "What is overfitting and how to prevent it?",
        "Explain bias-variance tradeoff.", "What is cross-validation?",
        "Explain gradient descent.", "What are decision trees?",
        "Explain random forests.", "What is feature engineering?",
        "What is dimensionality reduction?", "Explain linear regression vs logistic regression.",
        "What are neural networks?", "Explain precision vs recall.",
        "What is the ROC curve?", "Explain clustering algorithms.",
        "What is regularization?", "Explain ensemble methods.",
        "What is natural language processing?", "How do you handle missing data?",
        "What is a confusion matrix?", "Explain the K-means algorithm."
    ],
    'DevOps Engineer': [
        "What is CI/CD?", "Explain Docker and containers.",
        "What is Kubernetes?", "How does version control with Git work?",
        "What is infrastructure as code?", "Explain cloud computing models (IaaS, PaaS, SaaS).",
        "What is microservices architecture?", "Explain monitoring and logging.",
        "What is Terraform?", "How does load balancing work?",
        "What is blue-green deployment?", "Explain configuration management.",
        "What is serverless computing?", "How do you handle secrets management?",
        "What is API gateway?", "Explain container orchestration.",
        "What is a reverse proxy?", "How does DNS work?",
        "What is service mesh?", "Explain the 12-factor app methodology."
    ],
    'Database Administrator': [
        "Explain normalization and its forms.", "What is ACID in databases?",
        "Explain indexing and its types.", "What is a stored procedure?",
        "Explain SQL vs NoSQL.", "What is database replication?",
        "How does sharding work?", "Explain transactions and locks.",
        "What is a trigger?", "Explain query optimization.",
        "What is a view in SQL?", "How does connection pooling work?",
        "What is database partitioning?", "Explain backup strategies.",
        "What are database migrations?", "Explain the CAP theorem.",
        "What is a data warehouse?", "How does full-text search work?",
        "What is database caching?", "Explain MongoDB aggregation pipeline."
    ],
    'Mobile Developer': [
        "Explain MVC vs MVVM.", "What is React Native?",
        "How does state management work in mobile apps?", "What is Flutter?",
        "Explain the mobile app lifecycle.", "What is deep linking?",
        "How do push notifications work?", "What is offline-first architecture?",
        "Explain responsive design for mobile.", "What is code signing?",
        "How does app performance optimization work?", "What is dependency injection in mobile?",
        "Explain testing strategies for mobile.", "What is local storage in mobile apps?",
        "How do you handle API integration?", "What is continuous delivery for mobile?",
        "Explain accessibility in mobile apps.", "What is app bundling?",
        "How does memory management differ on mobile?", "Explain animation frameworks in mobile."
    ],
    'Cloud Architect': [
        "Explain the shared responsibility model.", "What is VPC?",
        "How does auto-scaling work?", "What is serverless architecture?",
        "Explain multi-cloud strategy.", "What is disaster recovery planning?",
        "How does CDN work?", "What is event-driven architecture?",
        "Explain cloud security best practices.", "What is cost optimization in cloud?",
        "How does service discovery work?", "What is a message queue?",
        "Explain API design principles.", "What is immutable infrastructure?",
        "How does caching strategy work?", "What is cloud-native development?",
        "Explain observability vs monitoring.", "What is zero trust security?",
        "How does data lake work?", "Explain hybrid cloud architecture."
    ],
    'QA Engineer': [
        "Explain functional vs non-functional testing.", "What is test automation?",
        "How does regression testing work?", "What is Selenium?",
        "Explain the testing pyramid.", "What is performance testing?",
        "How do you write test cases?", "What is BDD and TDD?",
        "Explain API testing.", "What is exploratory testing?",
        "How does load testing work?", "What is continuous testing?",
        "Explain defect lifecycle.", "What is test coverage?",
        "How do you handle flaky tests?", "What is security testing?",
        "Explain mobile testing strategies.", "What is A/B testing?",
        "How does visual testing work?", "Explain shift-left testing."
    ],
    'AI/ML Engineer': [
        "Explain transfer learning.", "What is a convolutional neural network?",
        "How does backpropagation work?", "What is natural language processing?",
        "Explain reinforcement learning.", "What is computer vision?",
        "How does model deployment work?", "What is MLOps?",
        "Explain attention mechanisms.", "What are transformers?",
        "How does hyperparameter tuning work?", "What is data augmentation?",
        "Explain GANs.", "What is model interpretability?",
        "How do you handle imbalanced datasets?", "What is federated learning?",
        "Explain embedding in NLP.", "What is AutoML?",
        "How does model versioning work?", "Explain ethical AI."
    ]
};

function evaluateAnswer(answer) {
    const wordCount = answer.trim().split(/\s+/).length;
    const hasTechnicalTerms = /api|function|class|method|algorithm|data|server|client|framework|database|model|architecture/i.test(answer);
    const hasExamples = /for example|such as|instance|like|e\.g\./i.test(answer);
    const isDetailed = wordCount > 30;
    let score = 4;
    if (wordCount > 10) score += 1;
    if (hasTechnicalTerms) score += 2;
    if (hasExamples) score += 1.5;
    if (isDetailed) score += 1.5;
    return {
        score: Math.min(10, Math.round(score * 10) / 10),
        understanding: hasTechnicalTerms ? 'Good' : 'Needs Improvement',
        quality: isDetailed ? 'Detailed' : 'Brief',
        accuracy: hasTechnicalTerms && isDetailed ? 'Accurate' : 'Partial',
        strengths: [
            ...(hasTechnicalTerms ? ['Used relevant technical terminology'] : []),
            ...(hasExamples ? ['Included examples'] : []),
            ...(isDetailed ? ['Provided detailed explanation'] : [])
        ],
        improvements: [
            ...(!hasTechnicalTerms ? ['Include more technical terms and concepts'] : []),
            ...(!hasExamples ? ['Add practical examples'] : []),
            ...(!isDetailed ? ['Provide a more comprehensive answer'] : [])
        ]
    };
}

function TechnicalInterview() {
    const [selectedRole, setSelectedRole] = useState(null);
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
            const avgScore = allResults.reduce((s, r) => s + r.feedback.score, 0) / allResults.length;
            await API.post('/interview/save', {
                type: 'technical', role: selectedRole,
                questions: allResults.map(r => ({ question: r.question, userAnswer: r.answer, score: r.feedback.score * 10, strengths: r.feedback.strengths, improvements: r.feedback.improvements })),
                overallScore: Math.round(avgScore * 10), totalQuestions: allResults.length, duration
            });
        } catch (err) { console.error('Failed to save session:', err); }
    };

    const questions = selectedRole ? roles[selectedRole] : [];

    const handleSubmit = () => {
        if (!answer.trim()) return;
        const feedback = evaluateAnswer(answer);
        setResults([...results, { question: questions[currentQ], answer, feedback }]);
        setCurrentFeedback(feedback);
        setShowFeedback(true);
    };

    const handleNext = () => {
        setAnswer('');
        setShowFeedback(false);
        setCurrentFeedback(null);
        if (currentQ + 1 >= questions.length) {
            setCompleted(true);
            saveToDatabase([...results, { question: questions[currentQ], answer, feedback: currentFeedback }]);
        } else {
            setCurrentQ(currentQ + 1);
        }
    };

    if (!selectedRole) {
        return (
            <div className="interview-module">
                <h1 className="text-4xl font-semibold text-white uppercase mb-4">Technical Interview</h1>
                <p className="page-subtitle text-xl text-white font-normal mb-12">Choose your target IT role to begin professional assessment</p>
                <div className="roles-grid">
                    {Object.keys(roles).map((role) => (
                        <button key={role} className="role-card" onClick={() => setSelectedRole(role)}>

                            <span>{role}</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    if (!isSetupComplete) {
        return (
            <InterviewSetup
                title={`${selectedRole} Interview`}
                description={`Practice your technical knowledge and problem-solving skills for a ${selectedRole} position.`}
                requirements={[
                    "A quiet environment to focus on technical concepts",
                    "A notebook or whiteboard for rough work (optional)",
                    "Familiarity with core concepts of the role"
                ]}
                tips={[
                    "Use correct technical terminology when explaining concepts.",
                    "If asked a coding concept, provide a brief structural example if possible.",
                    "Explain the 'why' and not just the 'what'.",
                    "Take a moment to structure your thoughts before typing."
                ]}
                onStart={() => {
                    setStartTime(Date.now());
                    setIsSetupComplete(true);
                }}
            />
        );
    }

    const avgScore = results.length > 0
        ? (results.reduce((s, r) => s + r.feedback.score, 0) / results.length).toFixed(1)
        : 0;

    if (completed) {
        return (
            <div className="interview-module">
                <div className="completion-card glass-card">
                    <h2>Technical Interview Completed!</h2>
                    <p>Role: <span className="text-white/80">{selectedRole}</span></p>
                    <div className="final-score">
                        <span className="big-score">{avgScore}</span>
                        <span className="score-label">/10 Average Score</span>
                    </div>
                    <div className="results-summary">
                        {results.map((r, i) => (
                            <div className="result-item" key={i}>
                                <span className="result-q">Q{i + 1}: {r.question}</span>
                                <span className={`result-score ${r.feedback.score >= 7 ? 'high' : r.feedback.score >= 5 ? 'medium' : 'low'}`}>{r.feedback.score}/10</span>
                            </div>
                        ))}
                    </div>
                    <div className="result-actions">
                        <button className="btn btn-primary" onClick={() => { setCurrentQ(0); setResults([]); setCompleted(false); }}>Retry</button>
                        <button className="btn btn-outline" onClick={() => { setSelectedRole(null); setCurrentQ(0); setResults([]); setCompleted(false); }}>Choose Another Role</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="interview-module">
            <div className="interview-header">
                <h2>Technical Interview - {selectedRole}</h2>
                <div className="progress-info">
                    <span>Question {currentQ + 1} of {questions.length}</span>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}></div>
                    </div>
                </div>
            </div>
            <div className="question-card glass-card">
                <span className="q-number">Q{currentQ + 1}</span>
                <h3>{questions[currentQ]}</h3>
            </div>
            {!showFeedback ? (
                <div className="answer-section">
                    <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type your technical answer..." rows={6} />
                    <button className="btn btn-primary" onClick={handleSubmit} disabled={!answer.trim()}>Submit Answer</button>
                </div>
            ) : (
                <div className="feedback-card glass-card">
                    <div className="feedback-header">
                        <h3>AI Feedback</h3>
                        <span className={`feedback-score ${currentFeedback.score >= 7 ? 'high' : currentFeedback.score >= 5 ? 'medium' : 'low'}`}>Score: {currentFeedback.score}/10</span>
                    </div>
                    <div className="feedback-metrics">
                        <div className="metric">Understanding: {currentFeedback.understanding}</div>
                        <div className="metric">Quality: {currentFeedback.quality}</div>
                        <div className="metric">Accuracy: {currentFeedback.accuracy}</div>
                    </div>
                    <div className="feedback-section"><h4>Strengths</h4><ul>{currentFeedback.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
                    <div className="feedback-section"><h4>Areas to Improve</h4><ul>{currentFeedback.improvements.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
                    <button className="btn btn-primary" onClick={handleNext}>{currentQ + 1 >= questions.length ? 'View Results' : 'Next Question →'}</button>
                </div>
            )}
        </div>
    );
}

export default TechnicalInterview;
