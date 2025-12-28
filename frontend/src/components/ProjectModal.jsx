import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './ProjectModal.css';

const ProjectModal = ({ project, isOpen, onClose }) => {
    // Close modal on ESC key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !project) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose} aria-label="Close modal">
                    ✕
                </button>

                {/* Project Header */}
                <div className="modal-header">
                    {project.category && (
                        <div className="project-category">{project.category}</div>
                    )}
                    <h2>{project.title}</h2>

                    {/* Impact Statement */}
                    {project.impact && (
                        <div className="modal-impact">
                            <strong>💡 Impact:</strong> {project.impact}
                        </div>
                    )}
                </div>

                {/* Metrics Section */}
                {project.metrics && project.metrics.length > 0 && (
                    <div className="modal-metrics">
                        <h3>Key Metrics</h3>
                        <div className="metrics-grid">
                            {project.metrics.map((metric, index) => (
                                <div key={index} className="metric-card">
                                    {metric}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="modal-body">
                    <h3>About This Project</h3>
                    <p>{project.detailedDesc || project.desc}</p>

                    {/* Tech Stack */}
                    <div className="modal-tech-section">
                        <h3>Technologies Used</h3>
                        <div className="tech-stack-grid">
                            {project.tech.map((tech, index) => (
                                <span key={index} className="tech-badge-large">{tech}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer with Actions */}
                <div className="modal-footer">
                    {project.link && project.link !== '#' && (
                        <a
                            href={project.link}
                            className="btn btn-primary"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {project.link.startsWith('/') ? 'View Project' : 'Live Demo →'}
                        </a>
                    )}
                    {project.github && (
                        <a
                            href={project.github}
                            className="btn btn-outline"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            GitHub →
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

ProjectModal.propTypes = {
    project: PropTypes.shape({
        title: PropTypes.string.isRequired,
        category: PropTypes.string,
        desc: PropTypes.string.isRequired,
        detailedDesc: PropTypes.string,
        tech: PropTypes.arrayOf(PropTypes.string).isRequired,
        metrics: PropTypes.arrayOf(PropTypes.string),
        impact: PropTypes.string,
        link: PropTypes.string,
        github: PropTypes.string,
    }),
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ProjectModal;
