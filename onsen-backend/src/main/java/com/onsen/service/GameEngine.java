package com.onsen.service;

import com.onsen.domain.GameSession;
import com.onsen.domain.Location;
import com.onsen.domain.PlayerAction;
import com.onsen.domain.WorldState;
import com.onsen.event.EventType;
import com.onsen.event.StoryEvent;
import com.onsen.kafka.EventProducer;
import com.onsen.state.StateEvaluator;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class GameEngine {

    private final SessionService sessionService;
    private final EventProducer eventProducer;
    private final StateEvaluator stateEvaluator;
    private final NarrativeService narrativeService;
    private final WebSocketService webSocketService;

    public GameEngine(SessionService sessionService,
            EventProducer eventProducer,
            StateEvaluator stateEvaluator,
            NarrativeService narrativeService,
            WebSocketService webSocketService) {
        this.sessionService = sessionService;
        this.eventProducer = eventProducer;
        this.stateEvaluator = stateEvaluator;
        this.narrativeService = narrativeService;
        this.webSocketService = webSocketService;
    }

    /**
     * Process a player action
     */
    public Optional<GameSession> processAction(PlayerAction action) {
        System.out.println("[GameEngine] processAction called for: " + action.getAction());

        // Get or create session
        Optional<GameSession> sessionOpt = sessionService.getSession(action.getSessionId());
        GameSession session;

        if (sessionOpt.isEmpty()) {
            System.out.println("[GameEngine] Session not found, creating new session: " + action.getSessionId());
            // Create new session if it doesn't exist (e.g., on GAME_START)
            session = sessionService.createSession(action.getSessionId());
        } else {
            session = sessionOpt.get();
        }
        System.out.println(
                "[GameEngine] Session found, current location: " + session.getWorldState().getCurrentLocation());

        // Create event
        StoryEvent event = new StoryEvent(action.getAction(), action.getMetadata());

        // Apply event to world state (synchronous for immediate response)
        stateEvaluator.applyEvent(event, session.getWorldState());
        System.out.println("[GameEngine] Event applied to world state");

        // Send scene update BEFORE location change so scene matches current location
        System.out.println("[GameEngine] About to call sendSceneUpdate...");
        sendSceneUpdate(session, action.getAction());
        System.out.println("[GameEngine] sendSceneUpdate completed");

        // Update location if needed (AFTER sending scene)
        updateLocationIfNeeded(action.getAction(), session);
        System.out.println("[GameEngine] Location updated if needed, new location: "
                + session.getWorldState().getCurrentLocation());

        // Check if staff guidance is required due to low SAN
        if (session.getWorldState().isRequiresStaffGuidance()) {
            System.out.println("[GameEngine] Staff guidance required - triggering event");
            session.getWorldState().clearStaffGuidance();
            // Send STAFF_GUIDANCE scene immediately
            sendSceneUpdate(session, EventType.STAFF_GUIDANCE);
            // Update location to SHARK_POOL
            session.getWorldState().setLocation(Location.SHARK_POOL);
        }

        // Add to event history
        session.addEvent(action.getAction().name());

        // Save updated session
        sessionService.saveSession(session);
        System.out.println("[GameEngine] Session saved");

        // Publish to Kafka (asynchronous for event sourcing)
        eventProducer.publish(event);
        System.out.println("[GameEngine] Event published to Kafka");

        // Send game state update (always send after every action)
        System.out.println("[GameEngine] About to call sendGameState...");
        sendGameState(session);
        System.out.println("[GameEngine] sendGameState completed");

        // Send available actions
        System.out.println("[GameEngine] About to call sendAvailableActions...");
        sendAvailableActions(session);
        System.out.println("[GameEngine] sendAvailableActions completed");

        // Check if ending has been triggered
        if (session.getWorldState().getEnding() != com.onsen.domain.EndingStatus.NONE) {
            System.out.println("[GameEngine] Ending triggered: " + session.getWorldState().getEnding());
            webSocketService.sendEndingTrigger(
                session.getSessionId(),
                session.getWorldState().getEnding().name()
            );
        }

        return Optional.of(session);
    }

    /**
     * Start a new game
     */
    public GameSession startGame(String playerId) {
        GameSession session = sessionService.createSession(playerId);

        // Publish GAME_START event
        StoryEvent startEvent = new StoryEvent(EventType.GAME_START, new HashMap<>());
        eventProducer.publish(startEvent);

        return session;
    }

    /**
     * Send scene update immediately via WebSocket
     */
    protected void sendSceneUpdate(GameSession session, EventType event) {
        System.out.println("[GameEngine] sendSceneUpdate - Event: " + event);
        System.out.println("[GameEngine] sendSceneUpdate - SessionId: " + session.getSessionId());

        // Get dialogue from NarrativeService
        var dialogueLines = narrativeService.getEventDialogue(event, session.getWorldState());
        System.out.println("[GameEngine] sendSceneUpdate - Dialogue lines retrieved: " + dialogueLines.size());

        // Convert dialogue to simple text lines for WebSocket
        var narrativeLines = dialogueLines.stream()
                .map(line -> {
                    String speaker = line.speaker() != null ? line.speaker() : "";
                    String text = line.text() != null ? line.text() : "";
                    String emotion = line.emotion();

                    if (emotion != null && !emotion.isEmpty()) {
                        return speaker + ": " + text + " (" + emotion + ")";
                    } else {
                        return speaker + ": " + text;
                    }
                })
                .toList();

        System.out.println("[GameEngine] sendSceneUpdate - Narrative lines to send: " + narrativeLines.size());

        // Send scene update immediately - frontend handles timing
        if (!narrativeLines.isEmpty()) {
            System.out.println("[GameEngine] sendSceneUpdate - Sending scene update via WebSocket");
            webSocketService.sendSceneUpdate(
                    session.getSessionId(),
                    generateSceneId(event, session),
                    narrativeLines);
            System.out.println("[GameEngine] sendSceneUpdate - Scene update sent successfully");
        } else {
            System.out.println("[GameEngine] sendSceneUpdate - WARNING: No narrative lines to send!");
        }
    }

    /**
     * Send current game state via WebSocket
     */
    protected void sendGameState(GameSession session) {
        Map<String, Object> stateData = new HashMap<>();
        WorldState world = session.getWorldState();

        stateData.put("san", world.getSanity());
        stateData.put("currentLocation", world.getCurrentLocation().name());
        stateData.put("loopCount", world.getLoopCount());
        stateData.put("bleeding", world.isBleeding());
        stateData.put("noticedFin", world.isNoticedFin());
        stateData.put("attackedVisitor", world.isAttackedVisitor());
        stateData.put("exposureLevel", world.getExposureLevel());

        webSocketService.sendStateUpdate(session.getSessionId(), stateData);
    }

    /**
     * Send available actions to frontend based on current game state
     */
    protected void sendAvailableActions(GameSession session) {
        List<Map<String, Object>> actions = new ArrayList<>();
        Location currentLocation = session.getWorldState().getCurrentLocation();

        // Define actions based on location
        switch (currentLocation) {
            case HOME:
                actions.add(createAction("INTO_FACILITY", "Enter the Onsen Facility", false));
                break;

            case ENTRANCE:
                actions.add(createAction("ENTER_HOT_SPRING", "Enter the Hot Spring", false));
                actions.add(createAction("ENTER_COLD_SPRING", "Enter the Cold Spring", false));
                actions.add(createAction("LOOK_AROUND", "Look Around", false));
                actions.add(createAction("LEAVE_FACILITY", "Leave the Facility", false));
                break;

            case HOT_SPRING:
                actions.add(createAction("STAY_TOO_LONG", "Stay a bit longer...", false));
                actions.add(createAction("LOOK_AROUND", "Look Around", false));
                actions.add(createAction("ENTER_COLD_SPRING", "Go to Cold Spring", false));
                actions.add(createAction("LEAVE_FACILITY", "Leave", false));
                break;

            case COLD_SPRING:
                actions.add(createAction("ENTER_HOT_SPRING", "Return to Hot Spring", false));
                actions.add(createAction("LEAVE_FACILITY", "Leave", false));
                break;

            case SHARK_POOL:
                // This location is usually forced/special
                actions.add(createAction("LEAVE_FACILITY", "Try to Leave", false));
                break;
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("actions", actions);

        webSocketService.sendAvailableActions(session.getSessionId(), payload);
    }

    /**
     * Helper to create action objects
     */
    private Map<String, Object> createAction(String id, String text, boolean disabled) {
        Map<String, Object> action = new HashMap<>();
        action.put("id", id);
        action.put("text", text);
        action.put("disabled", disabled);
        return action;
    }

    /**
     * Generate a unique scene ID for tracking
     */
    private String generateSceneId(EventType event, GameSession session) {
        return String.format("act%d_%s_%s",
                session.getWorldState().getLoopCount(),
                event.name().toLowerCase(),
                session.getWorldState().getCurrentLocation().name().toLowerCase());
    }

    /**
     * Update location based on action
     */
    private void updateLocationIfNeeded(EventType action, GameSession session) {
        Location newLocation = switch (action) {
            case INTO_FACILITY -> Location.ENTRANCE;
            case ENTER_HOT_SPRING -> Location.HOT_SPRING;
            case ENTER_COLD_SPRING -> Location.COLD_SPRING;
            case ENTER_SHARK_POOL -> Location.SHARK_POOL;
            case LEAVE_FACILITY -> Location.ENTRANCE;
            default -> session.getWorldState().getCurrentLocation();
        };

        session.getWorldState().setLocation(newLocation);
    }
}
