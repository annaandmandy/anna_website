import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Dynamic background component with location-based images and SAN-level effects
 */
export default function GameBackground({ location, sanLevel, isTransitioning }) {
    const [backgroundImage, setBackgroundImage] = useState('');

    useEffect(() => {
        // Map locations to background images (using EventType naming)
        const backgrounds = {
            HOME: '/game_img/GAME_START.png',
            ENTRANCE: '/game_img/INTO_FACILITY.png',
            HOT_SPRING: '/game_img/ENTER_HOT_SPRING.png',
            COLD_SPRING: '/game_img/ENTER_COLD_SPRING.png',
            SHARK_POOL: '/game_img/STAFF_GUIDANCE.png',
        };

        setBackgroundImage(backgrounds[location] || backgrounds.ENTRANCE);
    }, [location]);

    // Calculate visual distortion based on SAN level
    const getVisualEffects = () => {
        if (sanLevel < 30) {
            return {
                filter: 'blur(3px) saturate(0.3) brightness(0.7)',
                animation: 'subtle-shake 0.3s infinite',
            };
        } else if (sanLevel < 60) {
            return {
                filter: 'blur(1px) saturate(0.6) brightness(0.85)',
            };
        }
        return {};
    };

    return (
        <div
            className={`game-background ${isTransitioning ? 'transitioning' : ''}`}
            style={{
                backgroundImage: `url(${backgroundImage})`,
                ...getVisualEffects(),
            }}
        />
    );
}

GameBackground.propTypes = {
    location: PropTypes.string.isRequired,
    sanLevel: PropTypes.number.isRequired,
    isTransitioning: PropTypes.bool,
};

GameBackground.defaultProps = {
    isTransitioning: false,
};
