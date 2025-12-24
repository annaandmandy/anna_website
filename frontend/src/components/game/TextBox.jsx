import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * Text box component with typewriter effect and horror aesthetics
 */
export default function TextBox({ lines, sanLevel, onComplete, speed = 'normal' }) {
    const [displayedText, setDisplayedText] = useState('');
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [canAdvance, setCanAdvance] = useState(false);

    // Typewriter speed based on SAN level and user preference
    const getTypewriterDelay = useCallback(() => {
        const baseSpeed = {
            slow: 80,
            normal: 50,
            fast: 20,
        }[speed];

        // Slower typing at low SAN for dread
        if (sanLevel < 40) return baseSpeed + 30;
        if (sanLevel < 70) return baseSpeed + 10;
        return baseSpeed;
    }, [speed, sanLevel]);

    // Pause between lines based on SAN level
    const getLinePause = useCallback(() => {
        if (sanLevel < 40) return 2000;
        if (sanLevel < 70) return 1000;
        return 500;
    }, [sanLevel]);

    useEffect(() => {
        if (!lines || lines.length === 0) return;

        console.log('[TextBox] Received lines:', lines);
        setCurrentLineIndex(0);
        setDisplayedText('');
        setCanAdvance(false);
        typeNextLine(0);
    }, [lines]);

    const typeNextLine = useCallback((lineIndex) => {
        if (!lines || lineIndex >= lines.length) {
            setIsTyping(false);
            setCanAdvance(true);
            if (onComplete) onComplete();
            return;
        }

        setIsTyping(true);
        const line = lines[lineIndex];
        let charIndex = 0;

        const typeInterval = setInterval(() => {
            if (charIndex < line.length) {
                setDisplayedText((prev) => prev + line[charIndex]);
                charIndex++;
            } else {
                clearInterval(typeInterval);
                setIsTyping(false);

                // Pause before next line
                setTimeout(() => {
                    setDisplayedText((prev) => prev + '\n\n');
                    setCurrentLineIndex(lineIndex + 1);
                    typeNextLine(lineIndex + 1);
                }, getLinePause());
            }
        }, getTypewriterDelay());

        return () => clearInterval(typeInterval);
    }, [lines, getTypewriterDelay, getLinePause, onComplete]);

    const skipAnimation = () => {
        if (isTyping) {
            // Show all remaining text immediately
            const allText = lines.join('\n\n');
            setDisplayedText(allText);
            setIsTyping(false);
            setCanAdvance(true);
            if (onComplete) onComplete();
        }
    };

    const getTextEffects = () => {
        if (sanLevel < 30) {
            return 'text-horror-high';
        } else if (sanLevel < 60) {
            return 'text-horror-medium';
        }
        return '';
    };

    return (
        <div className="text-box" onClick={skipAnimation}>
            <div className={`text-content ${getTextEffects()}`}>
                {displayedText}
                {isTyping && <span className="cursor-blink">▌</span>}
            </div>
            {canAdvance && (
                <div className="advance-indicator">
                    <span className="pulse">▼</span>
                </div>
            )}
        </div>
    );
}

TextBox.propTypes = {
    lines: PropTypes.arrayOf(PropTypes.string).isRequired,
    sanLevel: PropTypes.number,
    onComplete: PropTypes.func,
    speed: PropTypes.oneOf(['slow', 'normal', 'fast']),
};

TextBox.defaultProps = {
    sanLevel: 100,
    onComplete: null,
    speed: 'normal',
};
