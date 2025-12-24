import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Dynamic background component with location-based images and SAN-level effects
 */
export default function GameBackground({ location, sanLevel, isTransitioning }) {
    const [backgroundImage, setBackgroundImage] = useState('');

    useEffect(() => {
        // Map locations to background images (using renamed files)
        const backgrounds = {
            HOME: '/game_img/HOME.png',
            ENTRANCE: '/game_img/ENTRANCE.png',
            HOT_SPRING: '/game_img/HOT_SPRING.png',
            COLD_SPRING: '/game_img/COLD_SPRING.png',
            SHARK_POOL: '/game_img/STAFF_GUIDANCE.png',
        };

        // Special case: if in HOT_SPRING and SAN is very low, show NOTICED_FIN image (distorted reality)
        if (location === 'HOT_SPRING' && sanLevel < 30) {
            setBackgroundImage('/game_img/NOTICED_FIN.png');
        } else {
            setBackgroundImage(backgrounds[location] || backgrounds.HOME);
        }
    }, [location, sanLevel]);

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
