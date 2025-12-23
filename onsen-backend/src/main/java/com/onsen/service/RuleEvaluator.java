package com.onsen.service;

import com.onsen.domain.GameSession;
import com.onsen.domain.Location;
import com.onsen.domain.WorldState;
import com.onsen.rule.RuleLoader;
import com.onsen.rule.RuleStage;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RuleEvaluator {

    private final RuleLoader ruleLoader;
    
    public RuleEvaluator() {
        this.ruleLoader = new RuleLoader();
    }
    
    /**
     * Determine if a rule should be shown based on game state
     */
    public Optional<RuleDisplay> shouldShowRule(GameSession session) {
        WorldState state = session.getWorldState();
        Location location = state.getCurrentLocation();
        
        // PAPER_1: Entrance - shown when entering facility
        if (location == Location.ENTRANCE && !hasSeenRule(session, RuleStage.PAPER_1)) {
            return Optional.of(new RuleDisplay(
                RuleStage.PAPER_1,
                ruleLoader.load(RuleStage.PAPER_1)
            ));
        }
        
        // PAPER_2: Hot Spring - shown when first entering hot spring
        if (location == Location.HOT_SPRING && !hasSeenRule(session, RuleStage.PAPER_2)) {
            return Optional.of(new RuleDisplay(
                RuleStage.PAPER_2,
                ruleLoader.load(RuleStage.PAPER_2)
            ));
        }
        
        // PAPER_3: Cold Spring - shown when entering cold spring
        if (location == Location.COLD_SPRING && !hasSeenRule(session, RuleStage.PAPER_3)) {
            return Optional.of(new RuleDisplay(
                RuleStage.PAPER_3,
                ruleLoader.load(RuleStage.PAPER_3)
            ));
        }
        
        // PAPER_4: Injury - shown when bleeding
        if (state.isBleeding() && !hasSeenRule(session, RuleStage.PAPER_4)) {
            return Optional.of(new RuleDisplay(
                RuleStage.PAPER_4,
                ruleLoader.load(RuleStage.PAPER_4)
            ));
        }
        
        return Optional.empty();
    }
    
    /**
     * Get rule content by stage
     */
    public String getRuleContent(RuleStage stage) {
        return ruleLoader.load(stage);
    }
    
    /**
     * Check if player has seen this rule before
     * (based on event history)
     */
    private boolean hasSeenRule(GameSession session, RuleStage stage) {
        String ruleEventMarker = "RULE_" + stage.name();
        return session.getEventHistory().contains(ruleEventMarker);
    }
    
    /**
     * Mark rule as seen
     */
    public void markRuleSeen(GameSession session, RuleStage stage) {
        session.addEvent("RULE_" + stage.name());
    }
    
    // DTO for rule display
    public record RuleDisplay(RuleStage stage, String content) {}
}
