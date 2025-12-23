package com.onsen.service;

import com.onsen.domain.EndingStatus;
import com.onsen.domain.GameSession;
import com.onsen.domain.Location;
import com.onsen.domain.WorldState;
import com.onsen.event.EventType;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SceneManager {

    private final RuleEvaluator ruleEvaluator;
    
    public SceneManager(RuleEvaluator ruleEvaluator) {
        this.ruleEvaluator = ruleEvaluator;
    }

    /**
     * Get current scene based on game state
     */
    public Map<String, Object> getCurrentScene(GameSession session) {
        WorldState state = session.getWorldState();
        Location location = state.getCurrentLocation();
        EndingStatus ending = state.getEnding();
        
        // If ending triggered, return ending scene
        if (ending != EndingStatus.NONE) {
            return getEndingScene(ending, state);
        }
        
        // Check if rule should be shown
        var ruleToShow = ruleEvaluator.shouldShowRule(session);
        
        // Get location scene
        final Map<String, Object> scene = getLocationScene(location, state);
        
        // Add rule if needed
        ruleToShow.ifPresent(rule -> {
            scene.put("ruleToShow", Map.of(
                "stage", rule.stage().name(),
                "content", rule.content()
            ));
            // Mark as seen
            ruleEvaluator.markRuleSeen(session, rule.stage());
        });
        
        return scene;
    }
    
    /**
     * Get available choices for current state
     */
    public List<Choice> getAvailableChoices(GameSession session) {
        WorldState state = session.getWorldState();
        Location location = state.getCurrentLocation();
        
        // If ending triggered, no more choices
        if (state.getEnding() != EndingStatus.NONE) {
            return List.of();
        }
        
        // Location-based choices
        return switch (location) {
            case HOME -> List.of(
                new Choice("enter", "Enter the hot spring facility", EventType.ENTER_HOT_SPRING)
            );
            
            case ENTRANCE -> List.of(
                new Choice("continue", "Continue to hot spring", EventType.ENTER_HOT_SPRING),
                new Choice("leave", "Leave facility", EventType.LEAVE_FACILITY)
            );
            
            case HOT_SPRING -> getHotSpringChoices(state);
            
            case COLD_SPRING -> List.of(
                new Choice("stay", "Stay in cold spring", EventType.ENTER_COLD_SPRING),
                new Choice("hot", "Return to hot spring", EventType.ENTER_HOT_SPRING),
                new Choice("leave", "Leave facility", EventType.LEAVE_FACILITY)
            );
            
            case SHARK_POOL -> List.of(); // No escape from shark pool
        };
    }
    
    private List<Choice> getHotSpringChoices(WorldState state) {
        List<Choice> choices = new ArrayList<>();
        choices.add(new Choice("stay", "Stay longer (risky)", EventType.STAY_TOO_LONG));
        choices.add(new Choice("look", "Look around", EventType.LOOK_AROUND));
        choices.add(new Choice("cold", "Go to cold spring", EventType.ENTER_COLD_SPRING));
        choices.add(new Choice("leave", "Leave facility", EventType.LEAVE_FACILITY));
        return choices;
    }
    
    private Map<String, Object> getLocationScene(Location location, WorldState state) {
        Map<String, Object> scene = new HashMap<>();
        scene.put("location", location.name());
        scene.put("narrative", getNarrative(location, state));
        scene.put("sanity", state.getSanity());
        scene.put("flags", getStateFlags(state));
        return scene;
    }
    
    private Map<String, Object> getEndingScene(EndingStatus ending, WorldState state) {
        Map<String, Object> scene = new HashMap<>();
        scene.put("ending", ending.name());
        scene.put("narrative", getEndingNarrative(ending));
        scene.put("finalSanity", state.getSanity());
        scene.put("loopCount", state.getLoopCount());
        scene.put("canContinue", isSurvivalLoop(ending));
        return scene;
    }
    
    private String getNarrative(Location location, WorldState state) {
        return switch (location) {
            case HOME -> "You wake up at home. Your mother suggests visiting the hot spring.";
            case ENTRANCE -> "You arrive at the Onsen Facility. A sign displays the entrance rules.";
            case HOT_SPRING -> {
                if (state.isNoticedFin()) {
                    yield "Something feels wrong. You notice strange shapes in the steam...";
                } else {
                    yield "The hot spring is peaceful. Several other visitors are relaxing.";
                }
            }
            case COLD_SPRING -> "The cold spring helps clear your mind. You feel more stable.";
            case SHARK_POOL -> "Staff guides you to the hottest pool. The water is uncomfortably warm.";
        };
    }
    
    private String getEndingNarrative(EndingStatus ending) {
        return switch (ending) {
            case SURVIVE_LOOP_A -> "You flee the facility in panic. When you wake up, it feels like a nightmare... but was it?";
            case SURVIVE_LOOP_B -> "The cold spring worked. You feel normal again. You leave safely.";
            case SURVIVE_LOOP_C -> "You followed all the rules perfectly. Nothing unusual happened.";
            case END_DISPOSAL -> "The sharks are hungry. Your instability made you... unsuitable.";
            case END_ASSIMILATION -> "You sink deeper. The water embraces you. You are becoming one with them.";
            default -> "";
        };
    }
    
    private Map<String, Object> getStateFlags(WorldState state) {
        Map<String, Object> flags = new HashMap<>();
        flags.put("noticedFin", state.isNoticedFin());
        flags.put("bleeding", state.isBleeding());
        flags.put("exposure", state.getExposureLevel());
        return flags;
    }
    
    private boolean isSurvivalLoop(EndingStatus ending) {
        return ending == EndingStatus.SURVIVE_LOOP_A ||
               ending == EndingStatus.SURVIVE_LOOP_B ||
               ending == EndingStatus.SURVIVE_LOOP_C;
    }
    
    // Choice DTO
    public record Choice(String id, String text, EventType action) {}
}
