import PropTypes from 'prop-types';

/**
 * HUD display for game state (SAN meter, location, loop count, status)
 */
export default function StateDisplay({ san, location, loopCount, status }) {
    const getSanColor = () => {
        if (san < 30) return '#ff4444';
        if (san < 60) return '#ffaa44';
        return '#44ff44';
    };

    const getSanLabel = () => {
        if (san < 30) return 'CRITICAL';
        if (san < 60) return 'UNSTABLE';
        return 'STABLE';
    };

    return (
        <div className="state-display">
            {/* SAN Meter */}
            <div className="san-meter">
                <div className="san-label">
                    SANITY: <span className="san-value">{san}</span>
                    <span className="san-status" style={{ color: getSanColor() }}>
                        {' '}
                        [{getSanLabel()}]
                    </span>
                </div>
                <div className="san-bar-container">
                    <div
                        className="san-bar"
                        style={{
                            width: `${san}%`,
                            backgroundColor: getSanColor(),
                        }}
                    />
                </div>
            </div>

            {/* Location */}
            <div className="location-display">
                <span className="location-label">LOCATION:</span>
                <span className="location-value">{location?.replace('_', ' ')}</span>
            </div>

            {/* Loop Count */}
            <div className="loop-display">
                <span className="loop-label">LOOP:</span>
                <span className="loop-value">{loopCount}</span>
            </div>

            {/* Status Effects */}
            {status && (
                <div className="status-effects">
                    {status.bleeding && (
                        <span className="status-icon bleeding pulse" title="Bleeding">
                            🩸
                        </span>
                    )}
                    {status.noticedFin && (
                        <span className="status-icon noticed-fin" title="Noticed the Fin">
                            🦈
                        </span>
                    )}
                    {status.attackedVisitor && (
                        <span className="status-icon attacked" title="Attacked Visitor">
                            ⚠️
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

StateDisplay.propTypes = {
    san: PropTypes.number,
    location: PropTypes.string,
    loopCount: PropTypes.number,
    status: PropTypes.shape({
        bleeding: PropTypes.bool,
        noticedFin: PropTypes.bool,
        attackedVisitor: PropTypes.bool,
    }),
};

StateDisplay.defaultProps = {
    san: 100,
    location: 'ENTRANCE',
    loopCount: 0,
    status: {},
};
