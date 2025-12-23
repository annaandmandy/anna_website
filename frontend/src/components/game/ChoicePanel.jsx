import PropTypes from 'prop-types';

/**
 * Choice panel for player actions
 */
export default function ChoicePanel({ choices, onSelect, visible }) {
    if (!visible || !choices || choices.length === 0) return null;

    return (
        <div className="choice-panel">
            {choices.map((choice) => (
                <button
                    key={choice.id}
                    className={`choice-button ${choice.disabled ? 'disabled' : ''}`}
                    onClick={() => !choice.disabled && onSelect(choice.id)}
                    disabled={choice.disabled}
                >
                    {choice.text}
                </button>
            ))}
        </div>
    );
}

ChoicePanel.propTypes = {
    choices: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired,
            disabled: PropTypes.bool,
        })
    ).isRequired,
    onSelect: PropTypes.func.isRequired,
    visible: PropTypes.bool,
};

ChoicePanel.defaultProps = {
    visible: true,
};
