package com.onsen.state;

import com.onsen.domain.EndingStatus;
import com.onsen.domain.Location;
import com.onsen.domain.WorldState;
import com.onsen.event.EventType;
import com.onsen.event.StoryEvent;
import org.springframework.stereotype.Component;

@Component
public class StateEvaluator {

    public void applyEvent(StoryEvent event, WorldState state) {

        EventType type = event.getType();

        switch (type) {

            case ENTER_HOT_SPRING -> {
                state.decreaseSanity(5);
            }

            case STAY_TOO_LONG -> {
                state.decreaseSanity(10);
                state.increaseExposure(1);
            }

            case LOOK_AROUND -> {
                if (state.getSanity() < 80) {
                    state.markNoticedFin();
                    state.decreaseSanity(8);
                }
            }

            case NOTICE_FIN -> {
                state.markNoticedFin();
                state.decreaseSanity(8);
            }

            case ENTER_COLD_SPRING -> {
                state.decreaseSanity(2);
                state.decreaseExposure(1);
                // 冷泉可以增加 SAN
                if (state.getSanity() >= 25 && state.getSanity() < 80) {
                    state.increaseSanity(15);
                }
            }

            case INJURED -> {
                state.markBleeding();
                state.decreaseSanity(20);
            }

           case ATTACKED_VISITOR -> {
                state.markAttackedVisitor();
                state.decreaseSanity(30);
            }

            case STAFF_GUIDANCE -> {
                // Staff guidance leads to shark pool
                state.decreaseSanity(5);
                state.setLocation(Location.SHARK_POOL);
            }

            default -> {
                // 其他事件暂不处理
            }
        }

        // Check if SAN is critically low and trigger STAFF_GUIDANCE if needed
        checkCriticalSanity(state, type);

        resolveEnding(state);
    }

    /**
     * Check if sanity is critically low and trigger staff intervention
     */
    private void checkCriticalSanity(WorldState state, EventType currentEvent) {
        // If SAN drops below 20 and we're not already being guided, trigger STAFF_GUIDANCE
        if (state.getSanity() < 20 &&
            currentEvent != EventType.STAFF_GUIDANCE &&
            state.getCurrentLocation() != Location.SHARK_POOL) {
            // This will be handled by the game engine to send STAFF_GUIDANCE event
            state.setRequiresStaffGuidance(true);
        }
    }

    private void resolveEnding(WorldState state) {
        
        // === True Endings (遊戲結束，不可繼續) ===
        
        // 被同化條件：SAN < 10 且在 SHARK_POOL
        if (state.getSanity() < 10 && state.getCurrentLocation() == Location.SHARK_POOL) {
            state.setEnding(EndingStatus.END_ASSIMILATION);
            return;
        }

        // 被吃掉條件：SAN >= 10 但有危險行為且在 SHARK_POOL
        if (state.getCurrentLocation() == Location.SHARK_POOL &&
            (state.isBleeding() || state.isAttackedVisitor())) {
            state.setEnding(EndingStatus.END_DISPOSAL);
            return;
        }

        // === Survival Loops (可以重來，Loop 繼續) ===
        
        // Survival Loop A:
        if (state.isNoticedFin() && state.getSanity() < 50) {
            state.setEnding(EndingStatus.SURVIVE_LOOP_A);
            return;
        }

        // Survival Loop B:
        if (state.getCurrentLocation() == Location.COLD_SPRING && 
            state.getSanity() >= 70) {
            state.setEnding(EndingStatus.SURVIVE_LOOP_B);
            return;
        }

        // Survival Loop C:    
        if (!state.isNoticedFin() && 
            state.getSanity() >= 80 && 
            state.getExposureLevel() == 0) {
            state.setEnding(EndingStatus.SURVIVE_LOOP_C);
            return;
        }
        
        // === Game Continues ===
        // If none of the above conditions are met, keep NONE state, player can continue the game
        // For example: SAN = 60, in HOT_SPRING, no fin seen -> continue playing
        if (state.getEnding() != EndingStatus.NONE) {
            // If there is already an ending, do not overwrite
            // This protection logic ensures that the ending will not be accidentally cleared
            return;
        }
        
        // Explicitly keep the game in progress state
        state.setEnding(EndingStatus.NONE);
    }
}
