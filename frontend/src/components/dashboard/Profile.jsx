import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API } from '../../context/AuthContext';

function Profile() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: '',
        address: '',
        education: [{ degree: '', institution: '', year: '', grade: '' }],
        skills: [''],
        projects: [{ title: '', description: '', technologies: '', link: '' }],
        experience: [{ company: '', role: '', duration: '', description: '' }],
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await API.get('/user/profile');
            const p = res.data;
            setFormData({
                name: p.name || user?.name || '',
                phone: p.phone || '',
                address: p.address || '',
                education: p.education?.length > 0 ? p.education : [{ degree: '', institution: '', year: '', grade: '' }],
                skills: (p.skills?.length > 0) ? p.skills : [''],
                projects: p.projects?.length > 0 ? p.projects : [{ title: '', description: '', technologies: '', link: '' }],
                experience: p.experience?.length > 0 ? p.experience : [{ company: '', role: '', duration: '', description: '' }],
            });
        } catch (err) {
            console.error('Failed to load profile:', err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleArrayChange = (section, index, field, value) => {
        const updated = [...formData[section]];
        updated[index] = { ...updated[index], [field]: value };
        setFormData({ ...formData, [section]: updated });
    };

    const addItem = (section, template) => {
        setFormData({ ...formData, [section]: [...formData[section], template] });
    };

    const removeItem = (section, index) => {
        const updated = formData[section].filter((_, i) => i !== index);
        setFormData({ ...formData, [section]: updated });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        try {
            const clean = {
                ...formData,
                skills: formData.skills.map(s => s.trim()).filter(s => s !== '')
            };
            await API.put('/user/profile', clean);
            setMessage('Profile updated successfully!');
        } catch (err) {
            setMessage('Failed to update profile.');
        }
        setSaving(false);
    };

    return (
        <div className="profile-page">
            <h1 className="text-4xl font-semibold mb-2 text-white">My Profile</h1>
            <p className="page-subtitle text-lg opacity-80 mb-10">Manage your candidate profile</p>

            {message && <div className={`profile-message ${message.includes('success') ? 'success' : 'error'}`}>{message}</div>}

            <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-section glass-card">
                    <h3>Personal Information</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input name="name" value={formData.name} onChange={handleChange} placeholder="Your name" />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" value={user?.email || ''} disabled className="disabled" />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" />
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <input name="address" value={formData.address} onChange={handleChange} placeholder="City, State" />
                        </div>
                    </div>
                </div>

                <div className="form-section glass-card">
                    <h3>Education</h3>
                    {formData.education.map((edu, i) => (
                        <div key={i} className="repeatable-item">
                            <div className="form-row">
                                <div className="form-group"><label>Degree</label>
                                    <input value={edu.degree} onChange={(e) => handleArrayChange('education', i, 'degree', e.target.value)} placeholder="B.Tech, M.Sc, etc." />
                                </div>
                                <div className="form-group"><label>Institution</label>
                                    <input value={edu.institution} onChange={(e) => handleArrayChange('education', i, 'institution', e.target.value)} placeholder="University name" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group"><label>Year</label>
                                    <input value={edu.year} onChange={(e) => handleArrayChange('education', i, 'year', e.target.value)} placeholder="2024" />
                                </div>
                                <div className="form-group"><label>Grade/CGPA</label>
                                    <input value={edu.grade} onChange={(e) => handleArrayChange('education', i, 'grade', e.target.value)} placeholder="8.5 CGPA" />
                                </div>
                            </div>
                            {formData.education.length > 1 && (
                                <button type="button" className="remove-btn" onClick={() => removeItem('education', i)}>Remove</button>
                            )}
                        </div>
                    ))}
                    <button type="button" className="add-btn" onClick={() => addItem('education', { degree: '', institution: '', year: '', grade: '' })}>+ Add Education</button>
                </div>

                <div className="form-section glass-card">
                    <h3>Skills</h3>
                    <div className="skills-grid-editor">
                        {formData.skills.map((skill, i) => (
                            <div key={i} className="skill-input-item">
                                <input
                                    value={skill}
                                    onChange={(e) => {
                                        const updated = [...formData.skills];
                                        updated[i] = e.target.value;
                                        setFormData({ ...formData, skills: updated });
                                    }}
                                    placeholder="e.g. React.js"
                                />
                                {formData.skills.length > 1 && (
                                    <button type="button" className="remove-skill-btn" onClick={() => {
                                        const updated = formData.skills.filter((_, idx) => idx !== i);
                                        setFormData({ ...formData, skills: updated });
                                    }}>×</button>
                                )}
                            </div>
                        ))}
                    </div>
                    <button type="button" className="add-btn" onClick={() => setFormData({ ...formData, skills: [...formData.skills, ''] })}>
                        + Add Skill
                    </button>
                </div>

                <div className="form-section glass-card">
                    <h3>Projects</h3>
                    {formData.projects.map((proj, i) => (
                        <div key={i} className="repeatable-item">
                            <div className="form-row">
                                <div className="form-group"><label>Project Title</label>
                                    <input value={proj.title} onChange={(e) => handleArrayChange('projects', i, 'title', e.target.value)} placeholder="Project name" />
                                </div>
                                <div className="form-group"><label>Technologies</label>
                                    <input value={proj.technologies} onChange={(e) => handleArrayChange('projects', i, 'technologies', e.target.value)} placeholder="React, Node.js, MongoDB" />
                                </div>
                            </div>
                            <div className="form-group"><label>Description</label>
                                <textarea value={proj.description} onChange={(e) => handleArrayChange('projects', i, 'description', e.target.value)} placeholder="Brief project description" rows="2" />
                            </div>
                            <div className="form-group"><label>Link</label>
                                <input value={proj.link} onChange={(e) => handleArrayChange('projects', i, 'link', e.target.value)} placeholder="GitHub or live link" />
                            </div>
                            {formData.projects.length > 1 && (
                                <button type="button" className="remove-btn" onClick={() => removeItem('projects', i)}>Remove</button>
                            )}
                        </div>
                    ))}
                    <button type="button" className="add-btn" onClick={() => addItem('projects', { title: '', description: '', technologies: '', link: '' })}>+ Add Project</button>
                </div>

                <div className="form-section glass-card">
                    <h3>Work Experience</h3>
                    {formData.experience.map((exp, i) => (
                        <div key={i} className="repeatable-item">
                            <div className="form-row">
                                <div className="form-group"><label>Company</label>
                                    <input value={exp.company} onChange={(e) => handleArrayChange('experience', i, 'company', e.target.value)} placeholder="Company name" />
                                </div>
                                <div className="form-group"><label>Role</label>
                                    <input value={exp.role} onChange={(e) => handleArrayChange('experience', i, 'role', e.target.value)} placeholder="Job title" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group"><label>Duration</label>
                                    <input value={exp.duration} onChange={(e) => handleArrayChange('experience', i, 'duration', e.target.value)} placeholder="Jan 2023 - Dec 2024" />
                                </div>
                            </div>
                            <div className="form-group"><label>Description</label>
                                <textarea value={exp.description} onChange={(e) => handleArrayChange('experience', i, 'description', e.target.value)} placeholder="Key responsibilities" rows="2" />
                            </div>
                            {formData.experience.length > 1 && (
                                <button type="button" className="remove-btn" onClick={() => removeItem('experience', i)}>Remove</button>
                            )}
                        </div>
                    ))}
                    <button type="button" className="add-btn" onClick={() => addItem('experience', { company: '', role: '', duration: '', description: '' })}>+ Add Experience</button>
                </div>

                <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Profile'}
                </button>
            </form>
        </div>
    );
}

export default Profile;
