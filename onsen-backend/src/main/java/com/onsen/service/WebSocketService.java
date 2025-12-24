package com.onsen.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Send scene update with narrative lines (immediate, no delays)
     * Frontend handles all timing and pacing
     */
    public void sendSceneUpdate(String sessionId, String sceneId, java.util.List<String> lines) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("sceneId", sceneId);
        payload.put("lines", lines);

        Map<String, Object> message = new HashMap<>();
        message.put("type", "SCENE_UPDATE");
        message.put("payload", payload);

        String destination = "/topic/game/" + sessionId;
        System.out.println("[WebSocketService] Sending to destination: " + destination);
        System.out.println("[WebSocketService] Message: " + message);

        messagingTemplate.convertAndSend(destination, (Object) message);
        System.out.println("[WebSocketService] SCENE_UPDATE sent!");
    }

    /**
     * Send narrative update to specific session
     * 
     * @deprecated Use sendSceneUpdate instead for proper message structure
     */
    @Deprecated
    public void sendNarrative(String sessionId, String narrative) {
        System.out.println("[WebSocketService] Preparing to send NARRATIVE");
        System.out.println("[WebSocketService] SessionId: " + sessionId);
        System.out.println("[WebSocketService] Narrative: " + narrative);

        Map<String, Object> message = new HashMap<>();
        message.put("type", "NARRATIVE");
        message.put("content", narrative);

        String destination = "/topic/game/" + sessionId;
        System.out.println("[WebSocketService] Sending to destination: " + destination);
        messagingTemplate.convertAndSend(destination, (Object) message);
        System.out.println("[WebSocketService] NARRATIVE sent!");
    }

    /**
     * Send state update to specific session
     */
    public void sendStateUpdate(String sessionId, Map<String, Object> state) {
        System.out.println("[WebSocketService] Preparing to send STATE_UPDATE");
        System.out.println("[WebSocketService] SessionId: " + sessionId);
        System.out.println("[WebSocketService] State: " + state);

        Map<String, Object> message = new HashMap<>();
        message.put("type", "STATE_UPDATE");
        message.put("payload", state); // Changed from 'content' to 'payload'

        String destination = "/topic/game/" + sessionId;
        System.out.println("[WebSocketService] Sending to destination: " + destination);

        messagingTemplate.convertAndSend(destination, (Object) message);
        System.out.println("[WebSocketService] STATE_UPDATE sent!");
    }

    /**
     * Send rule display notification
     */
    public void sendRuleNotification(String sessionId, String ruleStage, String content) {
        System.out.println("[WebSocketService] Preparing to send RULE_DISPLAY");
        System.out.println("[WebSocketService] SessionId: " + sessionId);
        System.out.println("[WebSocketService] Rule Stage: " + ruleStage);
        System.out.println("[WebSocketService] Content: " + content);

        Map<String, Object> message = new HashMap<>();
        message.put("type", "RULE_DISPLAY");
        message.put("stage", ruleStage);
        message.put("content", content);

        String destination = "/topic/game/" + sessionId;
        messagingTemplate.convertAndSend(destination, (Object) message);
    }

    /**
     * Send error message to specific session
     */
    public void sendError(String sessionId, String errorMessage) {
        Map<String, Object> message = new HashMap<>();
        message.put("type", "ERROR");
        message.put("content", errorMessage);

        String destination = "/topic/game/" + sessionId;
        messagingTemplate.convertAndSend(destination, (Object) message);
    }

    /**
     * Send available actions to frontend
     */
    public void sendAvailableActions(String sessionId, Map<String, Object> actionsData) {
        Map<String, Object> message = new HashMap<>();
        message.put("type", "ACTIONS_UPDATE");
        message.put("payload", actionsData);

        String destination = "/topic/game/" + sessionId;
        messagingTemplate.convertAndSend(destination, (Object) message);
    }
}
