package com.onsen.service;

import com.onsen.domain.GameSession;
import com.onsen.domain.Location;
import com.onsen.domain.PlayerAction;
import com.onsen.event.EventType;
import com.onsen.event.StoryEvent;
import com.onsen.kafka.EventProducer;
import com.onsen.state.StateEvaluator;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class GameEngine {

    private final SessionService sessionService;
    private final EventProducer eventProducer;
    private final StateEvaluator stateEvaluator;
    
    public GameEngine(SessionService sessionService, 
                      EventProducer eventProducer,
                      StateEvaluator stateEvaluator) {
        this.sessionService = sessionService;
        this.eventProducer = eventProducer;
        this.stateEvaluator = stateEvaluator;
    }
    
    /**
     * Process a player action
     */
    public Optional<GameSession> processAction(PlayerAction action) {
        // Get session
        Optional<GameSession> sessionOpt = sessionService.getSession(action.getSessionId());
        if (sessionOpt.isEmpty()) {
            return Optional.empty();
        }
        
        GameSession session = sessionOpt.get();
        
        // Create event
        StoryEvent event = new StoryEvent(action.getAction(), action.getMetadata());
        
        // Apply event to world state (synchronous for immediate response)
        stateEvaluator.applyEvent(event, session.getWorldState());
        
        // Update location if needed
        updateLocationIfNeeded(action.getAction(), session);
        
        // Add to event history
        session.addEvent(action.getAction().name());
        
        // Save updated session
        sessionService.saveSession(session);
        
        // Publish to Kafka (asynchronous for event sourcing)
        eventProducer.publish(event);
        
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
     * Update location based on action
     */
    private void updateLocationIfNeeded(EventType action, GameSession session) {
        Location newLocation = switch (action) {
            case ENTER_HOT_SPRING -> Location.HOT_SPRING;
            case ENTER_COLD_SPRING -> Location.COLD_SPRING;
            case ENTER_SHARK_POOL -> Location.SHARK_POOL;
            case LEAVE_FACILITY -> Location.ENTRANCE;
            default -> session.getWorldState().getCurrentLocation();
        };
        
        session.getWorldState().setLocation(newLocation);
    }
}
