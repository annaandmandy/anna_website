import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Rule modal overlay for displaying rule papers with horror presentation
 */
export default function RuleModal({ ruleId, content, onDismiss }) {
    const [canDismiss, setCanDismiss] = useState(false);

    useEffect(() => {
        if (ruleId) {
            // Force reading timer - can't dismiss for 3 seconds
            setCanDismiss(false);
            const timer = setTimeout(() => {
                setCanDismiss(true);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [ruleId]);

    if (!ruleId || !content) return null;

    const handleDismiss = () => {
        if (canDismiss && onDismiss) {
            onDismiss();
        }
    };

    return (
        <div className="rule-modal-overlay" onClick={handleDismiss}>
            <div className="rule-modal flicker" onClick={(e) => e.stopPropagation()}>
                <div className="rule-paper">
                    <h2 className="rule-title">Rules to Follow</h2>
                    <div className="rule-content">
                        {Array.isArray(content) ? (
                            content.map((line, index) => (
                                <p key={index} className="rule-line">
                                    {line}
                                </p>
                            ))
                        ) : (
                            <p className="rule-line">{content}</p>
                        )}
                    </div>
                    {canDismiss && (
                        <button className="dismiss-button" onClick={handleDismiss}>
                            [Close]
                        </button>
                    )}
                    {!canDismiss && (
                        <div className="reading-timer">
                            <span className="pulse-slow">...</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

RuleModal.propTypes = {
    ruleId: PropTypes.string,
    content: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
    ]),
    onDismiss: PropTypes.func,
};

RuleModal.defaultProps = {
    ruleId: null,
    content: null,
    onDismiss: null,
};
