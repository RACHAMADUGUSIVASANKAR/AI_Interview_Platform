import React, { useState } from 'react';

const faqs = [
    {
        question: "How does the AI interview work?",
        answer: "Our platform uses advanced AI models to simulate a real interview experience. You can choose from various modes (HR, Technical, etc.), and the AI will ask questions via voice or text. After your response, it provides instant feedback and follow-up questions."
    },
    {
        question: "Is the feedback personalized?",
        answer: "Yes! The AI analyzes your specific answers for clarity, technical correctness, and tone. It provides tailored suggestions to help you improve your communication and content."
    },
    {
        question: "Can I practice for specific job roles?",
        answer: "Absolutely. We offer role-specific technical interviews for software engineering, data science, management, and more. You can even upload your resume for a tailored mock interview."
    },
    {
        question: "Is there a free version available?",
        answer: "Yes, we offer a generous free tier that includes essential interview modes and basic AI feedback so you can start practicing immediately."
    }
];

function FAQ() {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="faq" id="faq">
            <div className="section-container">
                <h2 className="section-title">Common Questions</h2>
                <p className="section-subtitle">Everything you need to know about our platform</p>
                <div className="faq-list">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`faq-item glass-card ${activeIndex === index ? 'active' : ''}`}
                            onClick={() => toggleAccordion(index)}
                        >
                            <div className="faq-question">
                                <h3>{faq.question}</h3>
                                <span className="faq-icon">{activeIndex === index ? '−' : '+'}</span>
                            </div>
                            {activeIndex === index && (
                                <div className="faq-answer">
                                    <p>{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default FAQ;
