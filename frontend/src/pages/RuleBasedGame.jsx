import { useState, useEffect } from 'react';
import useWebSocket from '../hooks/useWebSocket';
import GameBackground from '../components/game/GameBackground';
import TextBox from '../components/game/TextBox';
import ChoicePanel from '../components/game/ChoicePanel';
import RuleModal from '../components/game/RuleModal';
import StateDisplay from '../components/game/StateDisplay';
import '../styles/game.css';

/**
 * Onsen Rule-Based Horror Game
 * Main game page component
 */
export default function RuleBasedGame() {
    const [sessionId, setSessionId] = useState(null);
    const [gameStarted, setGameStarted] = useState(false);
    const [currentScene, setCurrentScene] = useState(null);
    const [showChoices, setShowChoices] = useState(false);
    const [ruleContent, setRuleContent] = useState(null);
    const [lastAction, setLastAction] = useState(null);

    const {
        connected,
        gameState,
        sceneUpdate,
        ruleToShow,
        systemEvent,
        endingTriggered,
        error,
        availableActions,
        sendAction,
        clearSceneUpdate,
        clearRuleToShow,
    } = useWebSocket(sessionId);

    // Initialize game session
    useEffect(() => {
        // Generate or retrieve session ID
        const storedSession = localStorage.getItem('onsen_session_id');
        if (storedSession) {
            setSessionId(storedSession);
        } else {
            const newSession = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            setSessionId(newSession);
            localStorage.setItem('onsen_session_id', newSession);
        }
    }, []);

    // Handle scene updates
    useEffect(() => {
        if (sceneUpdate) {
            console.log('[Scene Update Received]', sceneUpdate);
            console.log('[Scene Update Lines]', sceneUpdate.lines);
            setCurrentScene(sceneUpdate);
            setShowChoices(false); // Hide choices while text is displaying
        }
    }, [sceneUpdate]);

    // Handle rule triggers
    useEffect(() => {
        if (ruleToShow) {
            // Fetch rule content - for now using placeholder
            setRuleContent([
                '1. Never enter the hot spring after midnight',
                '2. If you see a fin in the water, do not make eye contact',
                '3. Do not interact with visitors who smile at you',
                '4. If the water turns red, leave immediately',
            ]);
        }
    }, [ruleToShow]);

    // Handle system events
    useEffect(() => {
        if (systemEvent) {
            console.log('[System Event]', systemEvent);
            // Handle FORCED_SLEEP, CONTROL_LOCK, etc.
        }
    }, [systemEvent]);

    const startGame = () => {
        sendAction('GAME_START');
        setGameStarted(true);
    };

    const restartGame = () => {
        // Clear localStorage - fix: use correct key
        localStorage.removeItem('onsen_session_id');

        // Reset all state
        setGameStarted(false);
        setCurrentScene(null);
        setShowChoices(false);
        setRuleContent(null);

        // Force page reload to create new session
        window.location.reload();
    };

    const handleTextComplete = () => {
        // Show choices after text animation completes
        setShowChoices(true);
        clearSceneUpdate();
    };

    const handleChoiceSelect = (choiceId) => {
        sendAction(choiceId);
        setShowChoices(false);
        setLastAction(choiceId);

        // Clear lastAction after 3 seconds (so background can return to normal)
        setTimeout(() => {
            setLastAction(null);
        }, 3000);
    };

    const handleRuleDismiss = () => {
        setRuleContent(null);
        clearRuleToShow();
    };

    // Define available choices based on game state
    const getAvailableChoices = () => {
        if (!gameState) return [];

        const baseChoices = [
            { id: 'ENTER_HOT_SPRING', text: 'Enter the Hot Spring', disabled: false },
            { id: 'ENTER_COLD_SPRING', text: 'Enter the Cold Spring', disabled: false },
            { id: 'LOOK_AROUND', text: 'Look Around', disabled: false },
            { id: 'LEAVE_FACILITY', text: 'Leave the Facility', disabled: false },
        ];

        // Add conditional choices
        if (gameState.currentLocation === 'HOT_SPRING') {
            baseChoices.push({
                id: 'STAY_TOO_LONG',
                text: 'Stay a bit longer...',
                disabled: false,
            });
        }

        return baseChoices;
    };

    if (!sessionId) {
        return <div className="loading">Initializing...</div>;
    }

    if (endingTriggered) {
        // Map ending status to image and title
        const endingData = {
            END_DISPOSAL: {
                image: '/game_img/END_DISPOSAL.png',
                title: 'Disposal',
                message: 'You have been disposed of.'
            },
            END_ASSIMILATION: {
                image: '/game_img/END_ASSIMILATION.png',
                title: 'Assimilation',
                message: 'You have become one with them.'
            },
            SURVIVE_LOOP_A: {
                image: '/game_img/GAME_START.png',
                title: 'Survival - Loop A',
                message: 'You survived... for now.'
            },
            SURVIVE_LOOP_B: {
                image: '/game_img/GAME_START.png',
                title: 'Survival - Loop B',
                message: 'Another cycle complete.'
            },
            SURVIVE_LOOP_C: {
                image: '/game_img/GAME_START.png',
                title: 'Survival - Loop C',
                message: 'The loop continues...'
            }
        };

        const ending = endingData[endingTriggered] || {
            image: '/game_img/GAME_START.png',
            title: endingTriggered,
            message: 'The end.'
        };

        return (
            <div className="ending-screen" style={{ backgroundImage: `url(${ending.image})` }}>
                <div className="ending-overlay">
                    <h1 className="ending-title">{ending.title}</h1>
                    <p className="ending-message">{ending.message}</p>
                    <button className="restart-button" onClick={() => {
                        localStorage.removeItem('onsen_session_id');
                        window.location.reload();
                    }}>
                        Play Again
                    </button>
                </div>
            </div>
        );
    }

    if (!gameStarted) {
        return (
            <div className="game-start-screen">
                <div className="start-content">
                    <h1 className="game-title">Onsen</h1>
                    <p className="game-subtitle">A Rule-Based Horror Experience</p>
                    <button className="start-button" onClick={startGame} disabled={!connected}>
                        {connected ? 'Start Game' : 'Connecting...'}
                    </button>
                    {error && <div className="error-message">{error}</div>}
                </div>
            </div>
        );
    }

    return (
        <div className="game-container">
            {/* Background */}
            <GameBackground
                location={gameState?.currentLocation || 'HOME'}
                sanLevel={gameState?.san || 100}
                noticedFin={gameState?.noticedFin || false}
                lastAction={lastAction}
                isTransitioning={false}
            />

            {/* HUD */}
            <StateDisplay
                san={gameState?.san || 100}
                location={gameState?.currentLocation || 'HOME'}
                loopCount={gameState?.loopCount || 0}
                status={{
                    bleeding: gameState?.bleeding,
                    noticedFin: gameState?.noticedFin,
                    attackedVisitor: gameState?.attackedVisitor,
                }}
            />

            {/* Restart Button */}
            <button
                className="restart-button"
                onClick={restartGame}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    padding: '10px 20px',
                    background: 'rgba(139, 0, 0, 0.8)',
                    color: 'white',
                    border: '2px solid rgba(255, 0, 0, 0.5)',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    zIndex: 100,
                }}
            >
                🔄 Restart Game
            </button>

            {/* Text Box */}
            {currentScene && (
                <TextBox
                    lines={currentScene.lines}
                    sanLevel={gameState?.san || 100}
                    onComplete={handleTextComplete}
                    speed="normal"
                />
            )}

            {/* Choices */}
            <ChoicePanel
                choices={availableActions}
                onSelect={handleChoiceSelect}
                visible={showChoices}
            />

            {/* Rule Modal */}
            <RuleModal
                ruleId={ruleToShow}
                content={ruleContent}
                onDismiss={handleRuleDismiss}
            />

            {/* Debug Info (remove in production) */}
            {process.env.NODE_ENV === 'development' && (
                <div className="debug-info">
                    <div>Connected: {connected ? '✅' : '❌'}</div>
                    <div>Session: {sessionId}</div>
                    {gameState && (
                        <>
                            <div>SAN: {gameState.san}</div>
                            <div>Location: {gameState.currentLocation}</div>
                            <div>Loop: {gameState.loopCount}</div>
                        </>
                    )}
                    {currentScene && <div>Scene Lines: {currentScene.lines?.length || 0}</div>}
                    <div>Actions: {availableActions.length}</div>
                </div>
            )}
        </div>
    );
}
