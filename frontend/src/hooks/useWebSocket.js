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
    const [availableActions, setAvailableActions] = useState([]);

    const clientRef = useRef(null);

    useEffect(() => {
        if (!sessionId) return;

        // Use environment variable if available, otherwise determine from current page
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'localhost:8081';
        const wsUrl = import.meta.env.VITE_WS_URL;

        let brokerURL;
        let sockJsUrl;

        if (wsUrl) {
            // Explicit WebSocket URL provided
            brokerURL = wsUrl;
            sockJsUrl = wsUrl.replace('wss://', 'https://').replace('ws://', 'http://');
        } else {
            // Auto-detect based on page protocol
            const isSecure = window.location.protocol === 'https:';
            const wsProtocol = isSecure ? 'wss:' : 'ws:';
            const httpProtocol = isSecure ? 'https:' : 'http:';

            brokerURL = `${wsProtocol}//${backendUrl}/ws`;
            sockJsUrl = `${httpProtocol}//${backendUrl}/ws`;
        }

        console.log(`[WebSocket] Connecting to: ${brokerURL}`);
        console.log(`[WebSocket] SockJS fallback: ${sockJsUrl}`);
        console.log(`[WebSocket] Page protocol: ${window.location.protocol}`);

        // Create WebSocket connection
        const client = new Client({
            brokerURL,
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
            return new SockJS(sockJsUrl);
        };

        client.onConnect = () => {
            console.log('✅ WebSocket Connected');
            console.log('[WebSocket] Session ID:', sessionId);
            setConnected(true);

            // Subscribe to game session topic
            const subscription = client.subscribe(`/topic/game/${sessionId}`, (message) => {
                console.log('[WebSocket] Raw message received:', message);
                try {
                    const data = JSON.parse(message.body);
                    console.log('[WebSocket] Parsed message:', data);
                    handleMessage(data);
                } catch (err) {
                    console.error('Failed to parse WebSocket message:', err);
                    setError('Message parsing error');
                }
            });

            console.log('[WebSocket] Subscribed to:', `/topic/game/${sessionId}`);
        };

        client.onStompError = (frame) => {
            console.error('❌ WebSocket Error:', frame.headers['message']);
            console.error('[WebSocket] Error frame:', frame);
            setError(frame.headers['message']);
            setConnected(false);
        };

        client.onWebSocketClose = () => {
            console.log('🔌 WebSocket Disconnected');
            setConnected(false);
        };

        client.onWebSocketError = (error) => {
            console.error('❌ WebSocket connection error:', error);
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

            case 'ACTIONS_UPDATE':
                setAvailableActions(data.payload.actions || []);
                break;

            case 'ERROR':
                // Handle both payload.message and content for error messages
                const errorMessage = data.payload?.message || data.content || 'Unknown error';
                setError(errorMessage);
                console.error('[WebSocket] Error received:', errorMessage);
                break;

            default:
                console.warn('Unknown message type:', data.type);
        }
    }, []);

    const sendAction = useCallback((actionType, metadata = {}) => {
        console.log('[sendAction] Called with:', actionType, metadata);
        console.log('[sendAction] sessionId:', sessionId);
        console.log('[sendAction] connected:', connected);

        if (!clientRef.current || !connected) {
            console.error('Cannot send action: WebSocket not connected');
            return;
        }

        const payload = {
            sessionId,
            action: actionType,
            metadata,
        };

        console.log('[Action Payload Created]', JSON.stringify(payload, null, 2));

        // Send to backend action endpoint
        clientRef.current.publish({
            destination: '/app/game/action',
            body: JSON.stringify(payload),
        });

        console.log('[Action Sent Successfully]');
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
        availableActions,
        sendAction,
        clearSceneUpdate,
        clearRuleToShow,
        clearSystemEvent,
    };
}
