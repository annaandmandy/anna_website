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
        messagingTemplate.convertAndSend(destination, (Object) message);
    }

    /**
     * Send narrative update to specific session
     * 
     * @deprecated Use sendSceneUpdate instead for proper message structure
     */
    @Deprecated
    public void sendNarrative(String sessionId, String narrative) {
        Map<String, Object> message = new HashMap<>();
        message.put("type", "NARRATIVE");
        message.put("content", narrative);

        String destination = "/topic/game/" + sessionId;
        messagingTemplate.convertAndSend(destination, (Object) message);
    }

    /**
     * Send state update to specific session
     */
    public void sendStateUpdate(String sessionId, Map<String, Object> state) {
        Map<String, Object> message = new HashMap<>();
        message.put("type", "STATE_UPDATE");
        message.put("content", state);

        String destination = "/topic/game/" + sessionId;
        messagingTemplate.convertAndSend(destination, (Object) message);
    }

    /**
     * Send rule display notification
     */
    public void sendRuleNotification(String sessionId, String ruleStage, String content) {
        Map<String, Object> message = new HashMap<>();
        message.put("type", "RULE_DISPLAY");
        message.put("stage", ruleStage);
        message.put("content", content);

        String destination = "/topic/game/" + sessionId;
        messagingTemplate.convertAndSend(destination, (Object) message);
    }
}
