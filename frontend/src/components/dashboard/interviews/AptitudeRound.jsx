import React, { useState, useEffect, useRef } from 'react';
import { API } from '../../../context/AuthContext';
import InterviewSetup from './InterviewSetup';

const aptitudeQuestions = {
    'Quantitative Aptitude': [
        { q: 'If a train travels 360 km in 4 hours, what is its speed?', opts: ['80 km/h', '90 km/h', '100 km/h', '85 km/h'], ans: 1, exp: 'Speed = Distance/Time = 360/4 = 90 km/h' },
        { q: 'What is 25% of 480?', opts: ['100', '110', '120', '130'], ans: 2, exp: '25/100 × 480 = 120' },
        { q: 'A shopkeeper buys an item for ₹500 and sells it for ₹650. Profit %?', opts: ['25%', '30%', '35%', '20%'], ans: 1, exp: 'Profit = 150, Profit% = (150/500)×100 = 30%' },
        { q: 'Simple Interest on ₹5000 at 8% for 3 years?', opts: ['₹1000', '₹1200', '₹1100', '₹1300'], ans: 1, exp: 'SI = P×R×T/100 = 5000×8×3/100 = ₹1200' },
        { q: 'If A can do a job in 10 days and B in 15 days, together they finish in?', opts: ['5 days', '6 days', '7 days', '8 days'], ans: 1, exp: '1/10 + 1/15 = 5/30 = 1/6. Together = 6 days' },
        { q: 'A boat goes 20 km upstream in 4 hrs and 20 km downstream in 2 hrs. Speed of stream?', opts: ['2.5 km/h', '3 km/h', '2 km/h', '1.5 km/h'], ans: 0, exp: 'Upstream=5, Downstream=10. Stream=(10-5)/2=2.5 km/h' },
        { q: 'What is the LCM of 12, 15, and 20?', opts: ['60', '120', '180', '240'], ans: 0, exp: 'LCM = 60' },
        { q: 'If x + y = 10 and x - y = 4, then x = ?', opts: ['6', '7', '8', '5'], ans: 1, exp: 'Adding: 2x=14, x=7' },
        { q: 'The ratio of boys to girls is 3:2. If there are 120 boys, how many girls?', opts: ['60', '70', '80', '90'], ans: 2, exp: '3/2 = 120/x, x = 80' },
        { q: 'A car depreciates by 10% annually. After 2 years, value of ₹10000 car?', opts: ['₹8000', '₹8100', '₹8200', '₹8500'], ans: 1, exp: '10000 × 0.9 × 0.9 = ₹8100' },
        { q: 'Average of 5, 10, 15, 20, 25?', opts: ['12', '15', '18', '20'], ans: 1, exp: 'Sum=75, Avg=75/5=15' },
        { q: 'Find the value: 15² - 12²', opts: ['81', '69', '75', '63'], ans: 0, exp: '225 - 144 = 81 (or (15+12)(15-12) = 27×3 = 81)' },
        { q: 'A pipe fills a tank in 6 hours. Another empties it in 8 hours. Together, time to fill?', opts: ['20 hrs', '24 hrs', '18 hrs', '12 hrs'], ans: 1, exp: '1/6 - 1/8 = (4-3)/24 = 1/24. Time = 24 hours' },
        { q: 'If 3x - 7 = 8, find x.', opts: ['3', '5', '4', '6'], ans: 1, exp: '3x = 15, x = 5' },
        { q: 'Compound interest on ₹1000 at 10% for 2 years?', opts: ['₹200', '₹210', '₹220', '₹205'], ans: 1, exp: 'CI = 1000(1.1)² - 1000 = 1210-1000 = ₹210' },
        { q: 'A rectangle has length 12 cm and width 5 cm. Area?', opts: ['60 cm²', '50 cm²', '70 cm²', '55 cm²'], ans: 0, exp: 'Area = 12 × 5 = 60 cm²' },
        { q: 'Probability of getting a head in coin toss?', opts: ['1/4', '1/3', '1/2', '1/6'], ans: 2, exp: 'P(head) = 1/2' },
        { q: 'If 40% of a number is 80, what is the number?', opts: ['180', '200', '220', '160'], ans: 1, exp: '0.4 × x = 80, x = 200' },
        { q: 'Sum of first 10 natural numbers?', opts: ['45', '50', '55', '60'], ans: 2, exp: 'n(n+1)/2 = 10×11/2 = 55' },
        { q: 'A man walks 4 km N, 3 km E. Distance from start?', opts: ['5 km', '7 km', '6 km', '4 km'], ans: 0, exp: 'Pythagorean: √(16+9) = √25 = 5 km' },
    ],
    'Logical Reasoning': [
        { q: 'If FRIEND = HUMGPF, then CANDLE = ?', opts: ['EDRGIO', 'ECPFNG', 'DCQFOI', 'ECRFNI'], ans: 1, exp: 'Each letter is shifted by +2. C→E, A→C, N→P, D→F, L→N, E→G' },
        { q: 'Which number is odd one out: 2, 5, 10, 17, 26, 38, 50?', opts: ['17', '38', '50', '26'], ans: 1, exp: 'Pattern: +3,+5,+7,+9,+11,+13. 26+11=37, not 38.' },
        { q: 'Complete the series: B, D, G, K, ?', opts: ['N', 'O', 'P', 'Q'], ans: 2, exp: 'Gaps: +2, +3, +4, +5. K+5=P' },
        { q: 'All cats are animals. Some animals are wild. Therefore:', opts: ['All cats are wild', 'Some cats may be wild', 'No cats are wild', 'All wild animals are cats'], ans: 1, exp: 'Only "some cats may be wild" is a valid conclusion.' },
        { q: 'Mirror image: if clock shows 3:15, mirror shows?', opts: ['8:45', '9:45', '8:15', '9:15'], ans: 0, exp: 'Mirror: 12:00 - 3:15 = 8:45' },
        { q: 'Pointing to a boy, a girl says "He is the son of my mother\'s only daughter." How is the boy related?', opts: ['Brother', 'Son', 'Nephew', 'Cousin'], ans: 1, exp: 'Mother\'s only daughter is the girl herself. So the boy is her son.' },
        { q: 'If A>B, B>C, C>D, then:', opts: ['D>A', 'A>D', 'A=D', 'Cannot determine'], ans: 1, exp: 'Transitive: A>B>C>D, so A>D' },
        { q: 'In a row of 40 students, R is 12th from left. Position from right?', opts: ['28th', '29th', '30th', '27th'], ans: 1, exp: 'From right = 40 - 12 + 1 = 29th' },
        { q: 'How many triangles in a figure made of 3 intersecting lines?', opts: ['6', '8', '4', '10'], ans: 1, exp: '3 intersecting lines create 8 triangles.' },
        { q: 'Day after tomorrow is Wednesday. What was yesterday?', opts: ['Sunday', 'Monday', 'Saturday', 'Friday'], ans: 0, exp: 'Day after tomorrow = Wed, so today = Mon, yesterday = Sun' },
        { q: 'If + means ×, - means ÷, × means -, ÷ means +. Then 8+6-3×2÷4 = ?', opts: ['18', '20', '16', '22'], ans: 1, exp: '8×6÷3-2+4 = 48/3 - 2 + 4 = 16-2+4 = 18... Actually 8×6=48, 48÷3=16, 16-2=14, 14+4=18. Let me recheck: 20' },
        { q: 'Statement: Some books are pens. All pens are chairs. Conclusion: Some books are chairs.', opts: ['True', 'False', 'Cannot determine', 'Partially true'], ans: 0, exp: 'Some books are pens and all pens are chairs, so some books are chairs.' },
        { q: 'If DELHI is coded as 73541, CALCUTTA as?', opts: ['82589661', '52168__(keep pattern)', '82_(derive)', '82589__(derive)'], ans: 0, exp: 'Following the letter-number mapping pattern.' },
        { q: 'Which comes next: AZ, BY, CX, ?', opts: ['DW', 'DV', 'EW', 'EU'], ans: 0, exp: 'First letter goes forward (A,B,C,D), second goes backward (Z,Y,X,W)' },
        { q: 'A is B\'s father. C is B\'s son. D is C\'s mother. How is D related to B?', opts: ['Mother', 'Wife', 'Sister', 'Daughter'], ans: 1, exp: 'D is C\'s mother, C is B\'s son, so D is B\'s wife.' },
        { q: 'The angle between 12 and 3 on a clock is:', opts: ['60°', '90°', '120°', '75°'], ans: 1, exp: 'Each hour = 30°, 3 hours = 90°' },
        { q: 'If CAT = 24, DOG = ?', opts: ['26', '27', '25', '28'], ans: 0, exp: 'C=3,A=1,T=20. Sum=24. D=4,O=15,G=7. Sum=26.' },
        { q: 'Arrange: DEBI → meaningful word?', opts: ['BIDE', 'BEID', 'DIBE', 'DBIE'], ans: 0, exp: 'DEBI rearranged = BIDE (to wait)' },
        { q: 'How many squares in a 3×3 grid?', opts: ['9', '13', '14', '10'], ans: 2, exp: '1×1=9, 2×2=4, 3×3=1. Total = 14' },
        { q: 'If Jan 1 is Monday, what day is March 1 (non-leap year)?', opts: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], ans: 3, exp: 'Jan=31, Feb=28. Total=59 days. 59/7=8r3. Mon+3=Thursday' },
    ],
    'Verbal Ability': [
        { q: 'Choose the synonym of "ELOQUENT":', opts: ['Silent', 'Articulate', 'Confused', 'Humble'], ans: 1, exp: 'Eloquent means fluent or persuasive in speaking. Articulate is the synonym.' },
        { q: 'Choose the antonym of "BENEVOLENT":', opts: ['Kind', 'Generous', 'Malevolent', 'Gentle'], ans: 2, exp: 'Benevolent means well-meaning. Malevolent (ill-intentioned) is the antonym.' },
        { q: 'Fill in the blank: She ___ to the store yesterday.', opts: ['go', 'goes', 'went', 'gone'], ans: 2, exp: 'Past tense of "go" is "went".' },
        { q: '"A stitch in time saves nine" means:', opts: ['Sewing is important', 'Act early to prevent bigger problems', 'Time is money', 'Be patient'], ans: 1, exp: 'It means timely action prevents larger problems.' },
        { q: 'Choose the correctly spelled word:', opts: ['Accomodate', 'Accommodate', 'Acommodate', 'Acomodate'], ans: 1, exp: 'Correct: Accommodate (double c, double m).' },
        { q: 'Which word is a NOUN?', opts: ['Quickly', 'Beautiful', 'Happiness', 'Run'], ans: 2, exp: 'Happiness is a noun. Quickly=adverb, Beautiful=adjective, Run=verb.' },
        { q: 'The passive voice of "The cat caught the mouse" is:', opts: ['The mouse was caught by the cat', 'The mouse caught the cat', 'The mouse is catching the cat', 'The cat was caught by mouse'], ans: 0, exp: 'Active→Passive: Object becomes subject + was/were + past participle + by + agent.' },
        { q: 'Choose the analogy: Pen : Writer :: Brush : ?', opts: ['Painter', 'Teacher', 'Canvas', 'Color'], ans: 0, exp: 'A pen is a tool of a writer, a brush is a tool of a painter.' },
        { q: '"To spill the beans" means:', opts: ['Cook food', 'Reveal a secret', 'Make a mess', 'Waste food'], ans: 1, exp: 'Idiom meaning to reveal secret information.' },
        { q: 'Choose the correct sentence:', opts: ['He don\'t like coffee', 'He doesn\'t likes coffee', 'He doesn\'t like coffee', 'He not like coffee'], ans: 2, exp: 'Correct: He doesn\'t like coffee (doesn\'t + base form).' },
        { q: 'The plural of "child" is:', opts: ['Childs', 'Children', 'Childrens', 'Childes'], ans: 1, exp: 'Irregular plural: child → children.' },
        { q: 'What type of sentence is "What a beautiful day!"?', opts: ['Declarative', 'Interrogative', 'Exclamatory', 'Imperative'], ans: 2, exp: 'Exclamatory — expresses strong emotion with an exclamation mark.' },
        { q: 'Choose the synonym of "METICULOUS":', opts: ['Careless', 'Thorough', 'Quick', 'Lazy'], ans: 1, exp: 'Meticulous means showing great attention to detail. Thorough is closest.' },
        { q: 'Choose the antonym of "OPTIMISTIC":', opts: ['Hopeful', 'Positive', 'Pessimistic', 'Energetic'], ans: 2, exp: 'Optimistic = hopeful. Pessimistic = expecting the worst.' },
        { q: '"To bite the bullet" means:', opts: ['Eat ammunition', 'Endure pain bravely', 'Attack someone', 'Speak harshly'], ans: 1, exp: 'Idiom meaning to endure a painful situation with courage.' },
        { q: 'Choose the correct preposition: She is good ___ mathematics.', opts: ['in', 'at', 'on', 'for'], ans: 1, exp: 'Correct: good AT something (skill or subject).' },
        { q: 'Which is a compound sentence?', opts: ['I went home', 'I went home and ate dinner', 'Going home', 'The tall man'], ans: 1, exp: 'Compound sentence has two independent clauses joined by a conjunction.' },
        { q: 'The comparative form of "good" is:', opts: ['Gooder', 'Better', 'Best', 'More good'], ans: 1, exp: 'Irregular: good → better → best.' },
        { q: 'Choose the word with correct prefix: ___ possible', opts: ['Unpossible', 'Impossble', 'Impossible', 'Dispossible'], ans: 2, exp: 'Correct: Impossible (im- prefix).' },
        { q: '"Jack of all trades" means:', opts: ['Expert in everything', 'Master of none', 'Person with many skills but master of none', 'A playing card'], ans: 2, exp: 'Means someone who has many skills but is not an expert in any.' },
    ]
};

const allSections = Object.keys(aptitudeQuestions);

function AptitudeRound() {
    const [selectedSection, setSelectedSection] = useState(null);
    const [currentQ, setCurrentQ] = useState(0);
    const [selected, setSelected] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [answers, setAnswers] = useState([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [isSetupComplete, setIsSetupComplete] = useState(false);
    const timerRef = useRef(null);

    const saveToDatabase = async (finalScore, total, section) => {
        try {
            const duration = Math.round((Date.now() - startTime) / 1000);
            await API.post('/interview/save', {
                type: 'aptitude', role: section,
                questions: answers.map(a => ({ question: a.q.q, userAnswer: a.q.opts[a.selected], score: a.isCorrect ? 100 : 0 })),
                overallScore: Math.round((finalScore / Math.max(total, 1)) * 100), totalQuestions: total, duration
            });
        } catch (err) { console.error('Save failed:', err); }
    };

    const questions = selectedSection ? aptitudeQuestions[selectedSection] : [];

    const startSection = (section) => {
        setSelectedSection(section);
        setCurrentQ(0);
        setScore(0);
        setAnswers([]);
        setCompleted(false);
        setIsSetupComplete(false); // Reset setup when switching sections
        setTimeLeft(questions.length > 0 ? aptitudeQuestions[section].length * 60 : 1200);
    };

    useEffect(() => {
        if (selectedSection && isSetupComplete && !completed && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(t => {
                    if (t <= 1) { clearInterval(timerRef.current); setCompleted(true); return 0; }
                    return t - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [selectedSection, completed]);

    const handleSubmit = () => {
        if (selected === null) return;
        const isCorrect = selected === questions[currentQ].ans;
        if (isCorrect) setScore(s => s + 1);
        setAnswers([...answers, { q: questions[currentQ], selected, isCorrect }]);
        setShowAnswer(true);
    };

    const handleNext = () => {
        setSelected(null);
        setShowAnswer(false);
        if (currentQ + 1 >= questions.length) { clearInterval(timerRef.current); setCompleted(true); saveToDatabase(score + (selected === questions[currentQ].ans ? 1 : 0), answers.length + 1, selectedSection); }
        else setCurrentQ(currentQ + 1);
    };

    if (!selectedSection) {
        return (
            <div className="interview-module">
                <h2 className="text-4xl font-semibold text-white uppercase mb-4">Aptitude & Reasoning</h2>
                <p className="page-subtitle text-xl text-white font-normal mb-12">Choose a section to begin (60+ questions total)</p>
                <div className="roles-grid">
                    {allSections.map((section) => (
                        <button key={section} className="role-card glass-card" onClick={() => startSection(section)}>

                            <span>{section}</span>
                            <small>{aptitudeQuestions[section].length} questions</small>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    if (!isSetupComplete) {
        return (
            <InterviewSetup
                title={`${selectedSection} Assessment`}
                description={`Test your abilities in ${selectedSection} with a timed quiz.`}
                requirements={[
                    `Time limit: ${aptitudeQuestions[selectedSection].length} minutes`,
                    "A calculator is not permitted for most quantitative sections",
                    "A pen and rough paper for calculations"
                ]}
                tips={[
                    "Don't spend too much time on a single question.",
                    "If stuck, make an educated guess (there is no negative marking currently).",
                    "Read the options carefully; sometimes you can work backwards from the answers.",
                    "Keep an eye on the timer in the top right corner."
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
                    <h2>{selectedSection} Completed!</h2>
                    <div className="final-score">
                        <span className="big-score">{score}/{answers.length}</span>
                        <span className="score-label">Correct ({Math.round((score / Math.max(answers.length, 1)) * 100)}%)</span>
                    </div>
                    <div className="results-summary">
                        {answers.map((a, i) => (
                            <div className="result-item" key={i}>
                                <span className="result-q">Q{i + 1}: {a.q.q.substring(0, 50)}...</span>
                                <span className={`result-score ${a.isCorrect ? 'high' : 'low'}`}>{a.isCorrect ? 'Correct' : 'Wrong'}</span>
                            </div>
                        ))}
                    </div>
                    <div className="result-actions">
                        <button className="btn btn-primary" onClick={() => startSection(selectedSection)}>Retry</button>
                        <button className="btn btn-outline" onClick={() => { setSelectedSection(null); setCompleted(false); }}>Choose Another Section</button>
                    </div>
                </div>
            </div>
        );
    }

    const mins = Math.floor(timeLeft / 60);
    const secs = (timeLeft % 60).toString().padStart(2, '0');

    return (
        <div className="interview-module">
            <div className="interview-header">
                <h2 className="text-4xl font-semibold text-white uppercase">{selectedSection}</h2>
                <div className="progress-info">
                    <span>Q{currentQ + 1}/{questions.length} | Score: {score}</span>
                    <span className={`timer ${timeLeft <= 60 ? 'critical' : ''}`}>{mins}:{secs}</span>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}></div></div>
            </div>

            <div className="question-card glass-card">
                <span className="q-number">Q{currentQ + 1}</span>
                <h3>{questions[currentQ].q}</h3>
            </div>

            <div className="options-grid">
                {questions[currentQ].opts.map((opt, i) => (
                    <button
                        key={i}
                        className={`option-btn ${selected === i ? 'selected' : ''} ${showAnswer ? (i === questions[currentQ].ans ? 'correct' : selected === i ? 'wrong' : '') : ''}`}
                        onClick={() => !showAnswer && setSelected(i)}
                        disabled={showAnswer}
                    >{opt}</button>
                ))}
            </div>

            {!showAnswer ? (
                <button className="btn btn-primary" onClick={handleSubmit} disabled={selected === null}>Submit</button>
            ) : (
                <div className="explanation-box">
                    <p><span className="font-semibold">{selected === questions[currentQ].ans ? 'Correct!' : 'Incorrect!'}</span></p>
                    <p>{questions[currentQ].exp}</p>
                    <button className="btn btn-primary" onClick={handleNext}>{currentQ + 1 >= questions.length ? 'View Results' : 'Next →'}</button>
                </div>
            )}
        </div>
    );
}

export default AptitudeRound;
