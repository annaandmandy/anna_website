package com.onsen.api;

import com.onsen.domain.PlayerAction;
import com.onsen.event.EventType;
import com.onsen.service.GameEngine;
import com.onsen.service.WebSocketService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class GameWebSocketController {

    private final GameEngine gameEngine;
    private final WebSocketService webSocketService;

    public GameWebSocketController(
            GameEngine gameEngine,
            WebSocketService webSocketService) {
        this.gameEngine = gameEngine;
        this.webSocketService = webSocketService;
    }

    /**
     * Handle game actions via WebSocket
     * Receives messages sent to /app/game/action
     */
    @MessageMapping("/game/action")
    public void handleAction(@Payload Map<String, Object> payload) {
        System.out.println("[WS Controller] Received payload: " + payload);
        String sessionId = (String) payload.get("sessionId");
        try {
            String actionStr = (String) payload.get("action");
            System.out.println("[WS Controller] Parsing action: " + actionStr);
            EventType action = EventType.valueOf(actionStr);

            PlayerAction playerAction = new PlayerAction(action, sessionId);

            // Add metadata if present
            if (payload.containsKey("metadata") && payload.get("metadata") instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> metadata = (Map<String, Object>) payload.get("metadata");
                playerAction.setMetadata(metadata);
            }

            System.out.println("[WS Controller] Processing action: " + action + " for session: " + sessionId);
            System.out.println("[WS Controller] About to call gameEngine.processAction...");
            // Process the action
            var result = gameEngine.processAction(playerAction);
            System.out.println("[WS Controller] gameEngine.processAction returned: " + (result.isPresent() ? "Session present" : "Session empty"));
            System.out.println("[WS Controller] Action processed successfully");

        } catch (Exception e) {
            System.err.println("[WS Controller] Error: " + e.getMessage());
            e.printStackTrace(); // Log error to console
            if (sessionId != null) {
                webSocketService.sendError(sessionId, "Error processing action: " + e.getMessage());
            }
        }
    }
}
