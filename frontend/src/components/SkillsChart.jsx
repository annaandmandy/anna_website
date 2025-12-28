import React from 'react';
import PropTypes from 'prop-types';
import './SkillsChart.css';

const SkillsChart = ({ onSkillClick }) => {
    const skills = [
        {
            category: "AI & Machine Learning Engineering",
            items: [
                { name: "LangGraph & Multi-Agent Systems", level: 92, projects: 4 },
                { name: "RAG Pipelines & Vector Databases", level: 90, projects: 2 },
                { name: "LLM Orchestration & Prompting", level: 88, projects: 5 },
                { name: "Data Science & Analytics", level: 90, projects: 7 },
            ]
        },
        {
            category: "Backend & Distributed Systems",
            items: [
                { name: "FastAPI & Python (Async IO)", level: 95, projects: 4 },
                { name: "PostgreSQL & Schema Design", level: 90, projects: 3 },
                { name: "Distributed Infrastructure (Kafka, Redis)", level: 78, projects: 1 },
                { name: "RESTful API & Microservices", level: 92, projects: 4 },
            ]
        },
        {
            category: "Core Engineering (Systems)",
            items: [
                { name: "C++ (OOP & Data Structures)", level: 85, projects: 2 }, // Re-leveled as an "Add-on"
                { name: "Memory Management & Pointers", level: 80, projects: 2 },
                { name: "Docker & Containerization", level: 82, projects: 2 }
            ]
        },
        {
            category: "Full Stack & Web",
            items: [
                { name: "Next.js & React", level: 85, projects: 3 },
                { name: "Supabase & Serverless", level: 90, projects: 2 },
                { name: "TypeScript", level: 80, projects: 2 },
            ]
        }
    ];

    return (
        <div className="skills-chart-container">
            <div className="skills-chart-header">
                <h2>Technical Expertise</h2>
                <p>Click on any skill to filter related projects</p>
            </div>

            {skills.map((skillGroup, groupIndex) => (
                <div key={groupIndex} className="skill-group" data-aos="fade-up" data-aos-delay={groupIndex * 100}>
                    <h3 className="skill-category">{skillGroup.category}</h3>
                    <div className="skills-list">
                        {skillGroup.items.map((skill, index) => (
                            <div
                                key={index}
                                className="skill-item"
                                onClick={() => onSkillClick && onSkillClick(skill.name)}
                                role="button"
                                tabIndex={0}
                                onKeyPress={(e) => e.key === 'Enter' && onSkillClick && onSkillClick(skill.name)}
                            >
                                <div className="skill-info">
                                    <span className="skill-name">{skill.name}</span>
                                    <span className="skill-projects-badge">{skill.projects} project{skill.projects > 1 ? 's' : ''}</span>
                                </div>
                                <div className="skill-bar-container">
                                    <div
                                        className="skill-bar"
                                        style={{ width: `${skill.level}%` }}
                                        data-level={skill.level}
                                    >
                                        <span className="skill-level">{skill.level}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <div className="skills-legend" data-aos="fade-up">
                <div className="legend-item">
                    <div className="legend-bar legend-expert"></div>
                    <span>Expert (85-100%)</span>
                </div>
                <div className="legend-item">
                    <div className="legend-bar legend-advanced"></div>
                    <span>Advanced (70-84%)</span>
                </div>
                <div className="legend-item">
                    <div className="legend-bar legend-proficient"></div>
                    <span>Proficient (&lt;70%)</span>
                </div>
            </div>
        </div>
    );
};

SkillsChart.propTypes = {
    onSkillClick: PropTypes.func,
};

export default SkillsChart;
