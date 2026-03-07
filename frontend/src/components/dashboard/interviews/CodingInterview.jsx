import React, { useState } from 'react';
import { API } from '../../../context/AuthContext';
import InterviewSetup from './InterviewSetup';

const problems = {
    easy: {
        title: 'Two Sum',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nExample:\nInput: nums = [2, 7, 11, 15], target = 9\nOutput: [0, 1]\nExplanation: nums[0] + nums[1] = 2 + 7 = 9',
        testCases: [
            { input: 'nums = [2, 7, 11, 15], target = 9', expected: '[0, 1]' },
            { input: 'nums = [3, 2, 4], target = 6', expected: '[1, 2]' },
            { input: 'nums = [3, 3], target = 6', expected: '[0, 1]' }
        ],
        hint: 'Use a hash map to store complements for O(n) time complexity.'
    },
    medium: {
        title: 'Longest Substring Without Repeating Characters',
        description: 'Given a string s, find the length of the longest substring without repeating characters.\n\nExample:\nInput: s = "abcabcbb"\nOutput: 3\nExplanation: The answer is "abc", with length 3.',
        testCases: [
            { input: 's = "abcabcbb"', expected: '3' },
            { input: 's = "bbbbb"', expected: '1' },
            { input: 's = "pwwkew"', expected: '3' }
        ],
        hint: 'Use a sliding window approach with a set to track characters.'
    },
    hard: {
        title: 'Merge K Sorted Lists',
        description: 'You are given an array of k linked-lists, each sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.\n\nExample:\nInput: lists = [[1,4,5],[1,3,4],[2,6]]\nOutput: [1,1,2,3,4,4,5,6]',
        testCases: [
            { input: 'lists = [[1,4,5],[1,3,4],[2,6]]', expected: '[1,1,2,3,4,4,5,6]' },
            { input: 'lists = []', expected: '[]' },
            { input: 'lists = [[]]', expected: '[]' }
        ],
        hint: 'Use a min-heap (priority queue) to efficiently merge the lists.'
    }
};

const languages = ['Python', 'Java', 'C'];

const templates = {
    Python: { easy: 'def two_sum(nums, target):\n    # Your code here\n    pass', medium: 'def length_of_longest_substring(s):\n    # Your code here\n    pass', hard: 'def merge_k_lists(lists):\n    # Your code here\n    pass' },
    Java: { easy: 'public int[] twoSum(int[] nums, int target) {\n    // Your code here\n    return new int[]{};\n}', medium: 'public int lengthOfLongestSubstring(String s) {\n    // Your code here\n    return 0;\n}', hard: 'public ListNode mergeKLists(ListNode[] lists) {\n    // Your code here\n    return null;\n}' },
    C: { easy: 'int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Your code here\n    return NULL;\n}', medium: 'int lengthOfLongestSubstring(char* s) {\n    // Your code here\n    return 0;\n}', hard: '// Merge K sorted linked lists\nstruct ListNode* mergeKLists(struct ListNode** lists, int listsSize) {\n    // Your code here\n    return NULL;\n}' }
};

function CodingInterview() {
    const [selectedDifficulty, setSelectedDifficulty] = useState(null);
    const [selectedLang, setSelectedLang] = useState('Python');
    const [code, setCode] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [hintUsed, setHintUsed] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [isSetupComplete, setIsSetupComplete] = useState(false);

    const saveToDatabase = async (difficulty, codeSubmitted, hUsed) => {
        try {
            const duration = Math.round((Date.now() - startTime) / 1000);
            const score = codeSubmitted.length > 50 ? (hUsed ? 60 : 75) : 40;
            await API.post('/interview/save', {
                type: 'coding', role: difficulty,
                questions: [{ question: problems[difficulty].title, userAnswer: codeSubmitted, score }],
                overallScore: score, totalQuestions: 1, duration
            });
        } catch (err) { console.error('Save failed:', err); }
    };

    const problem = selectedDifficulty ? problems[selectedDifficulty] : null;

    const selectProblem = (diff) => {
        setSelectedDifficulty(diff);
        setCode(templates[selectedLang][diff]);
        setShowResult(false);
        setShowHint(false);
        setHintUsed(false);
    };

    const changeLang = (lang) => {
        setSelectedLang(lang);
        if (selectedDifficulty) {
            setCode(templates[lang][selectedDifficulty]);
        }
    };

    const handleSubmit = () => {
        setShowResult(true);
        saveToDatabase(selectedDifficulty, code, hintUsed);
    };

    const useHint = () => {
        setShowHint(true);
        setHintUsed(true);
    };

    if (!isSetupComplete) {
        return (
            <InterviewSetup
                title="Coding Assessment"
                description="Test your algorithmic and problem-solving skills with technical coding challenges in Python, Java, or C."
                requirements={[
                    "A stable internet connection to ensure your code is evaluated",
                    "A quiet environment free of distractions for at least 30-45 minutes"
                ]}
                tips={[
                    "Read the problem description and constraints carefully.",
                    "Review all provided test cases before writing code.",
                    "Optimize for time and space complexity where possible.",
                    "Use the AI Hint if you get stuck, but try to solve it independently first."
                ]}
                onStart={() => {
                    setStartTime(Date.now());
                    setIsSetupComplete(true);
                }}
            />
        );
    }
    if (!selectedDifficulty) {
        return (
            <div className="interview-module">
                <h2 className="text-4xl font-semibold mb-4 text-white uppercase tracking-tight">Coding Interview</h2>
                <p className="page-subtitle text-xl text-white font-normal mb-12">Choose difficulty level to start</p>
                <div className="difficulty-grid">
                    {['easy', 'medium', 'hard'].map((d) => (
                        <button key={d} className={`difficulty-card glass-card ${d}`} onClick={() => selectProblem(d)}>
                            <span className="diff-label">{d.charAt(0).toUpperCase() + d.slice(1)}</span>
                            <span className="diff-title">{problems[d].title}</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="interview-module coding-module">
            <div className="interview-header">
                <h2>Coding Interview - {problem.title}</h2>
                <span className={`difficulty-badge ${selectedDifficulty}`}>{selectedDifficulty.toUpperCase()}</span>
            </div>

            <div className="coding-layout">
                <div className="problem-panel">
                    <h3>Problem Description</h3>
                    <pre className="problem-desc">{problem.description}</pre>
                    <h4>Test Cases</h4>
                    {problem.testCases.map((tc, i) => (
                        <div className="test-case" key={i}>
                            <div><span className="font-semibold">Input:</span> {tc.input}</div>
                            <div><span className="font-semibold">Expected:</span> {tc.expected}</div>
                        </div>
                    ))}
                    {!hintUsed && (
                        <button className="btn btn-outline btn-sm" onClick={useHint}>Get AI Hint</button>
                    )}
                    {showHint && (
                        <div className="hint-box">
                            <span className="font-semibold">Hint:</span> {problem.hint}
                        </div>
                    )}
                </div>

                <div className="editor-panel">
                    <div className="editor-toolbar">
                        <div className="lang-selector">
                            {languages.map((lang) => (
                                <button key={lang} className={`lang-btn ${selectedLang === lang ? 'active' : ''}`} onClick={() => changeLang(lang)}>{lang}</button>
                            ))}
                        </div>
                        <button className="btn btn-primary btn-sm" onClick={handleSubmit}>▶ Run & Submit</button>
                    </div>
                    <textarea
                        className="code-editor"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        spellCheck={false}
                    />
                </div>
            </div>

            {showResult && (
                <div className="coding-result glass-card">
                    <h3>Evaluation Results</h3>
                    <div className="eval-grid">
                        <div className="eval-item">
                            <span className="font-semibold">Correctness</span>
                            <span className="eval-badge">Submitted</span>
                        </div>
                        <div className="eval-item">
                            <span className="font-semibold">Time Complexity</span>
                            <span className="eval-badge">Pending analysis</span>
                        </div>
                        <div className="eval-item">
                            <span className="font-semibold">Code Quality</span>
                            <span className="eval-badge">{code.length > 50 ? 'Good structure' : 'Too brief'}</span>
                        </div>
                        <div className="eval-item">
                            <span className="font-semibold">Hint Used</span>
                            <span className="eval-badge">{hintUsed ? 'Yes' : 'No'}</span>
                        </div>
                    </div>
                    <p className="eval-note">Note: Code evaluation is simulated. Connect to a code execution API for real test case evaluation.</p>
                    <button className="btn btn-outline" onClick={() => { setSelectedDifficulty(null); setShowResult(false); }}>← Back to Problems</button>
                </div>
            )}
        </div>
    );
}

export default CodingInterview;
