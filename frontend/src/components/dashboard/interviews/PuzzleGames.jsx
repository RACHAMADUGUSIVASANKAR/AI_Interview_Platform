import React, { useState } from 'react';
import { API } from '../../../context/AuthContext';
import InterviewSetup from './InterviewSetup';

const puzzles = [
    {
        type: 'Pattern',
        question: 'What comes next in the sequence: 2, 6, 12, 20, 30, ?',
        options: ['40', '42', '36', '38'],
        answer: 1,
        explanation: 'Differences: 4, 6, 8, 10, 12. Each difference increases by 2. So 30 + 12 = 42.'
    },
    {
        type: 'Logical',
        question: 'If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely Lazzies?',
        options: ['True', 'False', 'Cannot determine', 'Sometimes'],
        answer: 0,
        explanation: 'This follows the transitive property of logic. If A⊂B and B⊂C, then A⊂C.'
    },
    {
        type: 'Lateral',
        question: 'A man pushes his car to a hotel and tells the owner he is bankrupt. Why?',
        options: ['He crashed his car', 'He is playing Monopoly', 'He cannot afford gas', 'The hotel is free'],
        answer: 1,
        explanation: 'He is playing Monopoly! His game piece (car) landed on a hotel property.'
    },
    {
        type: 'Pattern',
        question: 'Complete the pattern: 1, 1, 2, 3, 5, 8, ?',
        options: ['11', '13', '10', '12'],
        answer: 1,
        explanation: 'This is the Fibonacci sequence. Each number is the sum of the two preceding ones: 5 + 8 = 13.'
    },
    {
        type: 'Logical',
        question: 'You have 3 boxes. One has apples, one has oranges, and one has both. All labels are wrong. You can pick one fruit from one box. Which box do you pick from to determine all labels?',
        options: ['Box labeled "Apples"', 'Box labeled "Oranges"', 'Box labeled "Both"', 'Any box'],
        answer: 2,
        explanation: 'Pick from "Both" box. Since labels are wrong, it has either only apples or only oranges. This lets you deduce all other boxes.'
    },
    {
        type: 'Pattern',
        question: 'If APPLE = 50, BANANA = 42, then CHERRY = ?',
        options: ['63', '72', '54', '66'],
        answer: 0,
        explanation: 'Count letters × value (A=1, B=2...). Sum of letter positions: C+H+E+R+R+Y = 3+8+5+18+18+25 = 77. But using simpler: letters × count = 9 × 7 = 63.'
    },
    {
        type: 'Lateral',
        question: 'A woman shoots her husband, then holds him underwater for 5 minutes. Next, she hangs him. But 10 minutes later they go out for dinner. How?',
        options: ['She is a ghost', 'She shot a photo, developed film', 'It was a dream', 'He is immortal'],
        answer: 1,
        explanation: 'She "shot" him with a camera, "held him under water" to develop the photo, and "hung" the photo up to dry.'
    },
    {
        type: 'Logical',
        question: 'You\'re in a dark room with a candle, a wood stove, and a gas lamp. You only have one match. What do you light first?',
        options: ['Candle', 'Wood stove', 'Gas lamp', 'The match'],
        answer: 3,
        explanation: 'You must light the match first before you can light anything else!'
    },
    {
        type: 'Pattern',
        question: 'What is the next number: 3, 3, 6, 9, 15, 24, ?',
        options: ['33', '39', '36', '30'],
        answer: 1,
        explanation: 'Each number is the sum of the two before it: 15 + 24 = 39 (similar to Fibonacci pattern).'
    },
    {
        type: 'Lateral',
        question: 'How many times can you subtract 5 from 25?',
        options: ['5 times', '1 time', '4 times', 'Infinite times'],
        answer: 1,
        explanation: 'Only once! After the first subtraction, you are subtracting from 20, not 25.'
    },
    {
        type: 'Logical',
        question: 'Two fathers and two sons go fishing. They each catch one fish. Total fish caught is 3. How?',
        options: ['One fish escaped', 'They are grandfather, father, son', 'They shared', 'Magic'],
        answer: 1,
        explanation: 'There are only 3 people: grandfather, father, and son. The father is both a son and a father.'
    },
    {
        type: 'Pattern',
        question: 'Find the odd one out: 2, 3, 5, 7, 11, 13, 15, 17',
        options: ['2', '15', '13', '17'],
        answer: 1,
        explanation: '15 is the only non-prime number in the sequence (15 = 3 × 5).'
    }
];

function PuzzleGames() {
    const [currentP, setCurrentP] = useState(0);
    const [selected, setSelected] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [answers, setAnswers] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [isSetupComplete, setIsSetupComplete] = useState(false);

    const saveToDatabase = async (finalScore, total) => {
        try {
            const duration = Math.round((Date.now() - startTime) / 1000);
            await API.post('/interview/save', {
                type: 'puzzle',
                questions: answers.map(a => ({ question: a.puzzle.question, userAnswer: a.puzzle.options[a.selected], score: a.isCorrect ? 100 : 0 })),
                overallScore: Math.round((finalScore / total) * 100), totalQuestions: total, duration
            });
        } catch (err) { console.error('Save failed:', err); }
    };

    const handleSelect = (idx) => {
        if (showAnswer) return;
        setSelected(idx);
    };

    const handleSubmit = () => {
        if (selected === null) return;
        const isCorrect = selected === puzzles[currentP].answer;
        if (isCorrect) setScore(score + 1);
        setAnswers([...answers, { puzzle: puzzles[currentP], selected, isCorrect }]);
        setShowAnswer(true);
    };

    const handleNext = () => {
        setSelected(null);
        setShowAnswer(false);
        if (currentP + 1 >= puzzles.length) {
            setCompleted(true);
            saveToDatabase(score + (selected === puzzles[currentP].answer ? 1 : 0), puzzles.length);
        } else {
            setCurrentP(currentP + 1);
        }
    };

    if (!isSetupComplete) {
        return (
            <InterviewSetup
                title="PUZZLES & THINKING"
                description="Challenge your logical reasoning, pattern recognition, and lateral thinking skills."
                requirements={[
                    "A focused mind",
                    "A pen and paper (optional, but helpful for pattern mapping)"
                ]}
                tips={[
                    "Don't rush; read the question carefully.",
                    "For lateral thinking puzzles, the most obvious answer is usually wrong.",
                    "Look for simple mathematical sequences (differences, sums, primes).",
                    "There's no time limit per question, but your total duration is recorded."
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
                    <h2>Puzzle Games Completed!</h2>
                    <div className="final-score">
                        <span className="big-score">{score}/{puzzles.length}</span>
                        <span className="score-label">Correct Answers</span>
                    </div>
                    <div className="results-summary">
                        {answers.map((a, i) => (
                            <div className="result-item" key={i}>
                                <span className="result-q">[{a.puzzle.type}] {a.puzzle.question.substring(0, 50)}...</span>
                                <span className={`result-score ${a.isCorrect ? 'high' : 'low'}`}>{a.isCorrect ? 'Correct' : 'Wrong'}</span>
                            </div>
                        ))}
                    </div>
                    <button className="btn btn-primary" onClick={() => { setCurrentP(0); setScore(0); setAnswers([]); setCompleted(false); }}>Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="interview-module">
            <div className="interview-header">
                <h2 className="text-4xl font-semibold text-white uppercase">Puzzle Games</h2>
                <div className="progress-info">
                    <span>Puzzle {currentP + 1} of {puzzles.length} | Score: {score}</span>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${((currentP + 1) / puzzles.length) * 100}%` }}></div>
                    </div>
                </div>
            </div>

            <div className="question-card glass-card">
                <span className="q-number">{puzzles[currentP].type}</span>
                <h3>{puzzles[currentP].question}</h3>
            </div>

            <div className="options-grid">
                {puzzles[currentP].options.map((opt, i) => (
                    <button
                        key={i}
                        className={`option-btn ${selected === i ? 'selected' : ''} ${showAnswer ? (i === puzzles[currentP].answer ? 'correct' : selected === i ? 'wrong' : '') : ''}`}
                        onClick={() => handleSelect(i)}
                        disabled={showAnswer}
                    >
                        {opt}
                    </button>
                ))}
            </div>

            {!showAnswer ? (
                <button className="btn btn-primary" onClick={handleSubmit} disabled={selected === null}>Submit Answer</button>
            ) : (
                <div className="explanation-box">
                    <p><span className="font-semibold">{selected === puzzles[currentP].answer ? 'Correct!' : 'Incorrect!'}</span></p>
                    <p>{puzzles[currentP].explanation}</p>
                    <button className="btn btn-primary" onClick={handleNext}>
                        {currentP + 1 >= puzzles.length ? 'View Results' : 'Next Puzzle →'}
                    </button>
                </div>
            )}
        </div>
    );
}

export default PuzzleGames;
