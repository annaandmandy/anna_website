import { useState, useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

/**
 * Custom hook for WebSocket connection to Onsen game backend
 * Handles SCENE_UPDATE, STATE_UPDATE, RULE_TRIGGER, SYSTEM_EVENT, ENDING_TRIGGER messages
 */
export default function useWebSocket(sessionId) {
    const [connected, setConnected] = useState(false);
    const [gameState, setGameState] = useState(null);
    const [sceneUpdate, setSceneUpdate] = useState(null);
    const [ruleToShow, setRuleToShow] = useState(null);
    const [systemEvent, setSystemEvent] = useState(null);
    const [endingTriggered, setEndingTriggered] = useState(null);
    const [error, setError] = useState(null);

    const clientRef = useRef(null);

    useEffect(() => {
        if (!sessionId) return;

        // Create WebSocket connection
        const client = new Client({
            brokerURL: `ws://localhost:8081/ws`, // Matches backend port
            connectHeaders: {},
            debug: (str) => {
                console.log('[WebSocket Debug]', str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        // Use SockJS for fallback
        client.webSocketFactory = () => {
            return new SockJS('http://localhost:8081/ws');
        };

        client.onConnect = () => {
            console.log('✅ WebSocket Connected');
            setConnected(true);

            // Subscribe to game session topic
            client.subscribe(`/topic/game/${sessionId}`, (message) => {
                try {
                    const data = JSON.parse(message.body);
                    handleMessage(data);
                } catch (err) {
                    console.error('Failed to parse WebSocket message:', err);
                    setError('Message parsing error');
                }
            });
        };

        client.onStompError = (frame) => {
            console.error('❌ WebSocket Error:', frame.headers['message']);
            setError(frame.headers['message']);
            setConnected(false);
        };

        client.onWebSocketClose = () => {
            console.log('🔌 WebSocket Disconnected');
            setConnected(false);
        };

        client.activate();
        clientRef.current = client;

        return () => {
            if (clientRef.current) {
                clientRef.current.deactivate();
            }
        };
    }, [sessionId]);

    const handleMessage = useCallback((data) => {
        console.log('[WS Message]', data);

        switch (data.type) {
            case 'STATE_UPDATE':
                setGameState(data.payload);
                break;

            case 'SCENE_UPDATE':
                setSceneUpdate({
                    sceneId: data.payload.sceneId,
                    lines: data.payload.lines,
                    timestamp: Date.now(),
                });
                break;

            case 'RULE_TRIGGER':
                setRuleToShow(data.payload.ruleId);
                break;

            case 'SYSTEM_EVENT':
                setSystemEvent(data.payload.event);
                break;

            case 'ENDING_TRIGGER':
                setEndingTriggered(data.payload.endingStatus);
                break;

            case 'ERROR':
                setError(data.payload.message);
                break;

            default:
                console.warn('Unknown message type:', data.type);
        }
    }, []);

    const sendAction = useCallback((actionType, metadata = {}) => {
        if (!clientRef.current || !connected) {
            console.error('Cannot send action: WebSocket not connected');
            return;
        }

        const payload = {
            sessionId,
            action: actionType,
            metadata,
        };

        // Send to backend action endpoint
        clientRef.current.publish({
            destination: '/app/game/action',
            body: JSON.stringify(payload),
        });

        console.log('[Action Sent]', payload);
    }, [connected, sessionId]);

    const clearSceneUpdate = useCallback(() => {
        setSceneUpdate(null);
    }, []);

    const clearRuleToShow = useCallback(() => {
        setRuleToShow(null);
    }, []);

    const clearSystemEvent = useCallback(() => {
        setSystemEvent(null);
    }, []);

    return {
        connected,
        gameState,
        sceneUpdate,
        ruleToShow,
        systemEvent,
        endingTriggered,
        error,
        sendAction,
        clearSceneUpdate,
        clearRuleToShow,
        clearSystemEvent,
    };
}
