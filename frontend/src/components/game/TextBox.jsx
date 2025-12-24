import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * Text box component with typewriter effect and horror aesthetics
 * Shows one line at a time - user must click/press key to advance
 */
export default function TextBox({ lines, sanLevel, onComplete, speed = 'normal' }) {
    const [displayedText, setDisplayedText] = useState('');
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [canAdvance, setCanAdvance] = useState(false);
    const [allComplete, setAllComplete] = useState(false);

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


    // Initialize when new lines arrive
    useEffect(() => {
        if (!lines || lines.length === 0) return;

        console.log('[TextBox] Received lines:', lines);
        setCurrentLineIndex(0);
        setDisplayedText('');
        setCanAdvance(false);
        setAllComplete(false);
        setIsTyping(true);
    }, [lines]);

    // Type the current line
    useEffect(() => {
        if (!lines || lines.length === 0 || !isTyping) return;
        if (currentLineIndex >= lines.length) {
            setIsTyping(false);
            setAllComplete(true);
            if (onComplete) onComplete();
            return;
        }

        const line = lines[currentLineIndex];
        let charIndex = 0;
        setDisplayedText('');
        setCanAdvance(false);

        const typeInterval = setInterval(() => {
            if (charIndex < line.length) {
                setDisplayedText((prev) => prev + line[charIndex]);
                charIndex++;
            } else {
                clearInterval(typeInterval);
                setIsTyping(false);
                setCanAdvance(true);
            }
        }, getTypewriterDelay());

        return () => clearInterval(typeInterval);
    }, [currentLineIndex, lines, isTyping, getTypewriterDelay, onComplete]);

    // Handle user advancing to next line
    const handleAdvance = useCallback(() => {
        if (isTyping) {
            // Skip typing animation, show full current line
            if (lines && currentLineIndex < lines.length) {
                setDisplayedText(lines[currentLineIndex]);
                setIsTyping(false);
                setCanAdvance(true);
            }
        } else if (canAdvance && currentLineIndex < lines.length - 1) {
            // Move to next line
            setCurrentLineIndex(prev => prev + 1);
            setIsTyping(true);
        } else if (canAdvance && currentLineIndex === lines.length - 1) {
            // All lines complete
            setAllComplete(true);
            if (onComplete) onComplete();
        }
    }, [isTyping, canAdvance, currentLineIndex, lines, onComplete]);

    // Keyboard support (Enter or Space to advance)
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleAdvance();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleAdvance]);

    const getTextEffects = () => {
        if (sanLevel < 30) {
            return 'text-horror-high';
        } else if (sanLevel < 60) {
            return 'text-horror-medium';
        }
        return '';
    };

    return (
        <div className="text-box" onClick={handleAdvance}>
            <div className={`text-content ${getTextEffects()}`}>
                {displayedText}
                {isTyping && <span className="cursor-blink">▌</span>}
            </div>
            {canAdvance && !allComplete && (
                <div className="advance-indicator">
                    <span className="pulse">▼ Click or press Enter/Space to continue</span>
                </div>
            )}
            {allComplete && (
                <div className="advance-indicator">
                    <span className="pulse">✓ Complete</span>
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
