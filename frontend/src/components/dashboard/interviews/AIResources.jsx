import React from 'react';

const resources = [
    {
        category: 'Data Structures & Algorithms',
        items: [
            { title: 'Data Structures Full Course', source: 'YouTube', url: 'https://www.youtube.com/results?search_query=data+structures+full+course', icon: '' },
            { title: 'DSA Tutorial', source: 'GeeksForGeeks', url: 'https://www.geeksforgeeks.org/data-structures/', icon: '' },
            { title: 'DSA with Java', source: 'W3Schools', url: 'https://www.w3schools.com/java/', icon: '' },
        ]
    },
    {
        category: 'Web Development',
        items: [
            { title: 'Full Stack Web Development', source: 'YouTube', url: 'https://www.youtube.com/results?search_query=full+stack+web+development+course', icon: '' },
            { title: 'HTML/CSS/JS Tutorial', source: 'W3Schools', url: 'https://www.w3schools.com/', icon: '' },
            { title: 'React.js Documentation', source: 'React', url: 'https://react.dev/', icon: '' },
            { title: 'Node.js Tutorial', source: 'GeeksForGeeks', url: 'https://www.geeksforgeeks.org/nodejs/', icon: '' },
        ]
    },
    {
        category: 'Python Programming',
        items: [
            { title: 'Python Full Course', source: 'YouTube', url: 'https://www.youtube.com/results?search_query=python+full+course+beginners', icon: '' },
            { title: 'Python Tutorial', source: 'W3Schools', url: 'https://www.w3schools.com/python/', icon: '' },
            { title: 'Python DSA', source: 'GeeksForGeeks', url: 'https://www.geeksforgeeks.org/python-programming-language/', icon: '' },
        ]
    },
    {
        category: 'Java Programming',
        items: [
            { title: 'Java Full Course', source: 'YouTube', url: 'https://www.youtube.com/results?search_query=java+full+course', icon: '' },
            { title: 'Java Collections Explained', source: 'GeeksForGeeks', url: 'https://www.geeksforgeeks.org/collections-in-java-2/', icon: '' },
            { title: 'Java Tutorial', source: 'W3Schools', url: 'https://www.w3schools.com/java/', icon: '' },
        ]
    },
    {
        category: 'Database & SQL',
        items: [
            { title: 'SQL Full Course', source: 'YouTube', url: 'https://www.youtube.com/results?search_query=sql+full+course', icon: '' },
            { title: 'MongoDB Tutorial', source: 'GeeksForGeeks', url: 'https://www.geeksforgeeks.org/mongodb-tutorial/', icon: '' },
            { title: 'SQL Tutorial', source: 'W3Schools', url: 'https://www.w3schools.com/sql/', icon: '' },
        ]
    },
    {
        category: 'Interview Preparation',
        items: [
            { title: 'Top 100 Interview Questions', source: 'YouTube', url: 'https://www.youtube.com/results?search_query=top+interview+questions', icon: '' },
            { title: 'Interview Preparation Guide', source: 'GeeksForGeeks', url: 'https://www.geeksforgeeks.org/company-interview-corner/', icon: '' },
            { title: 'Aptitude Questions', source: 'GeeksForGeeks', url: 'https://www.geeksforgeeks.org/aptitude-questions-and-answers/', icon: '' },
        ]
    },
    {
        category: 'AI & Machine Learning',
        items: [
            { title: 'Machine Learning Full Course', source: 'YouTube', url: 'https://www.youtube.com/results?search_query=machine+learning+full+course', icon: '' },
            { title: 'AI/ML Tutorial', source: 'GeeksForGeeks', url: 'https://www.geeksforgeeks.org/machine-learning/', icon: '' },
            { title: 'Python for Data Science', source: 'W3Schools', url: 'https://www.w3schools.com/datascience/', icon: '' },
        ]
    },
    {
        category: 'Soft Skills & Communication',
        items: [
            { title: 'Communication Skills Course', source: 'YouTube', url: 'https://www.youtube.com/results?search_query=communication+skills+for+interview', icon: '' },
            { title: 'Body Language Tips', source: 'YouTube', url: 'https://www.youtube.com/results?search_query=body+language+interview+tips', icon: '' },
            { title: 'Resume Building Guide', source: 'YouTube', url: 'https://www.youtube.com/results?search_query=resume+building+tips', icon: '' },
        ]
    }
];

function AIResources() {
    return (
        <div className="interview-module">
            <h1 className="text-4xl font-semibold text-white uppercase mb-4">AI Recommended Resources</h1>
            <p className="page-subtitle text-xl text-white font-normal mb-12">Curated courses and tutorials based on common weak areas.</p>

            <div className="resources-container">
                {resources.map((cat, i) => (
                    <div className="resource-category" key={i}>
                        <h3>{cat.category}</h3>
                        <div className="resource-cards">
                            {cat.items.map((item, j) => (
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="resource-card" key={j}>
                                    <span className="resource-icon">{item.icon}</span>
                                    <div className="resource-info">
                                        <span className="resource-title">{item.title}</span>
                                        <span className="resource-source">{item.source}</span>
                                    </div>
                                    <span className="resource-arrow">→</span>
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AIResources;
