import React, { useState, useRef } from 'react';

function ResumeAnalyzer() {
    const [resumeText, setResumeText] = useState('');
    const [fileName, setFileName] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const fileRef = useRef(null);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFileName(file.name);

        if (file.type === 'text/plain') {
            const text = await file.text();
            setResumeText(text);
        } else if (file.type === 'application/pdf') {
            // Read PDF as text (basic extraction)
            const reader = new FileReader();
            reader.onload = () => {
                const text = extractTextFromPDF(reader.result);
                setResumeText(text);
            };
            reader.readAsArrayBuffer(file);
        } else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
            const reader = new FileReader();
            reader.onload = () => {
                const text = extractTextFromDocx(reader.result);
                setResumeText(text);
            };
            reader.readAsArrayBuffer(file);
        } else {
            // Fallback: read as text
            const text = await file.text();
            setResumeText(text);
        }
    };

    const extractTextFromPDF = (arrayBuffer) => {
        // Simple PDF text extraction - extracts readable text from PDF binary
        const uint8 = new Uint8Array(arrayBuffer);
        let text = '';
        let inStream = false;
        let streamData = '';

        const decoder = new TextDecoder('utf-8', { fatal: false });
        const rawText = decoder.decode(uint8);

        // Extract text between BT and ET markers (PDF text objects)
        const matches = rawText.match(/\(([^)]+)\)/g);
        if (matches) {
            text = matches.map(m => m.slice(1, -1)).join(' ');
        }

        if (!text.trim()) {
            // Fallback: extract any readable ASCII text
            const readable = rawText.replace(/[^\x20-\x7E\n\r]/g, ' ').replace(/\s+/g, ' ').trim();
            const words = readable.split(' ').filter(w => w.length > 2 && /[a-zA-Z]/.test(w));
            text = words.slice(0, 500).join(' ');
        }

        return text || 'Could not extract text from PDF. Please try a .txt file or paste the content manually.';
    };

    const extractTextFromDocx = (arrayBuffer) => {
        // Very basic DOCX text extraction
        const uint8 = new Uint8Array(arrayBuffer);
        const decoder = new TextDecoder('utf-8', { fatal: false });
        const rawText = decoder.decode(uint8);
        // DOCX files contain XML, try to extract text content
        const matches = rawText.match(/<w:t[^>]*>([^<]+)<\/w:t>/g);
        if (matches) {
            return matches.map(m => m.replace(/<[^>]+>/g, '')).join(' ');
        }
        return 'Could not extract text from DOCX. Please try a .txt file or paste the content manually.';
    };

    const analyzeResume = () => {
        if (!resumeText.trim()) return;
        setAnalyzing(true);

        setTimeout(() => {
            const text = resumeText.toLowerCase();
            const hasEmail = /\S+@\S+\.\S+/.test(text);
            const hasPhone = /\d{10}|\d{3}[-.]?\d{3}[-.]?\d{4}/.test(text);
            const hasSkills = /skills|technologies|proficient/i.test(text);
            const hasExperience = /experience|worked|internship|job/i.test(text);
            const hasProjects = /project|developed|built|created/i.test(text);
            const hasEducation = /education|degree|university|college|b\.tech|m\.tech|bsc|msc/i.test(text);
            const hasAchievements = /achievement|award|certified|certificate/i.test(text);
            const hasMeasurables = /\d+%|\d+ users|\d+ projects|increased|decreased|improved/i.test(text);

            const keywords = ['javascript', 'python', 'react', 'node', 'java', 'sql', 'mongodb', 'html', 'css', 'git', 'api', 'agile', 'docker', 'aws', 'linux'];
            const foundKeywords = keywords.filter(k => text.includes(k));
            const wordCount = resumeText.trim().split(/\s+/).length;

            let score = 30;
            if (hasEmail) score += 5;
            if (hasPhone) score += 5;
            if (hasSkills) score += 10;
            if (hasExperience) score += 10;
            if (hasProjects) score += 10;
            if (hasEducation) score += 8;
            if (hasAchievements) score += 7;
            if (hasMeasurables) score += 10;
            if (foundKeywords.length > 3) score += 5;
            score = Math.min(100, score);

            const suggestions = [];
            if (!hasEmail) suggestions.push('Add your email address');
            if (!hasPhone) suggestions.push('Include a phone number');
            if (!hasSkills) suggestions.push('Add a dedicated Skills section');
            if (!hasExperience) suggestions.push('Include work experience or internships');
            if (!hasProjects) suggestions.push('Add project descriptions with technologies used');
            if (!hasEducation) suggestions.push('Include your education details');
            if (!hasAchievements) suggestions.push('Add achievements and certifications');
            if (!hasMeasurables) suggestions.push('Include measurable achievements (e.g., "Improved performance by 30%")');
            if (foundKeywords.length < 3) suggestions.push('Add more technical keywords relevant to your target role');
            if (wordCount < 100) suggestions.push('Resume seems too short. Aim for 300-600 words.');

            setResult({
                score,
                sections: {
                    'Contact Info': hasEmail && hasPhone ? 'Complete' : 'Missing items',
                    'Skills': hasSkills ? 'Found' : 'Missing',
                    'Experience': hasExperience ? 'Found' : 'Missing',
                    'Projects': hasProjects ? 'Found' : 'Missing',
                    'Education': hasEducation ? 'Found' : 'Missing',
                    'Achievements': hasAchievements ? 'Found' : 'Consider adding',
                    'Measurable Results': hasMeasurables ? 'Found' : 'Missing'
                },
                keywords: foundKeywords,
                suggestions,
                wordCount
            });
            setAnalyzing(false);
        }, 1500);
    };

    return (
        <div className="interview-module">
            <h1 className="text-4xl font-semibold text-white uppercase mb-4">Resume Analyzer</h1>
            <p className="page-subtitle text-xl text-white font-normal mb-12">AI-powered ATS scoring and optimization suggestions</p>

            <div className="resume-input-section glass-card">
                <div className="file-upload-area" onClick={() => fileRef.current?.click()}>
                    <input
                        ref={fileRef}
                        type="file"
                        accept=".pdf,.docx,.doc,.txt"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                    />
                    <div className="upload-content">
                        <span className="upload-icon">Upload</span>
                        <p>{fileName || 'Click to upload your resume'}</p>
                        <small>Supports PDF, DOCX, DOC, TXT files</small>
                    </div>
                </div>

                <button className="btn btn-primary" onClick={analyzeResume} disabled={analyzing || !resumeText.trim()} style={{ marginTop: '20px' }}>
                    {analyzing ? 'Analyzing...' : 'Analyze Resume'}
                </button>
            </div>

            {
                result && (
                    <div className="resume-results glass-card">
                        <div className="resume-score-card">
                            <div className="resume-score-circle">
                                <span className="resume-score-value">{result.score}%</span>
                                <span className="resume-score-label">ATS Score</span>
                            </div>
                            <div className={`resume-grade ${result.score >= 80 ? 'grade-a' : result.score >= 60 ? 'grade-b' : 'grade-c'}`}>
                                {result.score >= 80 ? 'A - Excellent' : result.score >= 60 ? 'B - Good' : 'C - Needs Improvement'}
                            </div>
                        </div>

                        <div className="resume-section-check">
                            <h3>Section Analysis</h3>
                            {Object.entries(result.sections).map(([key, val]) => (
                                <div className="section-check-item" key={key}>
                                    <span className="section-name">{key}</span>
                                    <span className={`section-status ${val === 'Found' || val === 'Complete' ? 'status-good' : 'status-warn'}`}>{val}</span>
                                </div>
                            ))}
                        </div>

                        {result.keywords.length > 0 && (
                            <div className="resume-keywords">
                                <h3>Keywords Found</h3>
                                <div className="keyword-tags">
                                    {result.keywords.map((k, i) => <span className="keyword-tag" key={i}>{k}</span>)}
                                </div>
                            </div>
                        )}

                        <div className="resume-suggestions">
                            <h3>Suggestions for Improvement</h3>
                            <ul>
                                {result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>

                        <div className="word-count-info">
                            <span>Word Count: {result.wordCount}</span>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

export default ResumeAnalyzer;
