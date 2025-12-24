package com.onsen.state;

import com.onsen.domain.EndingStatus;
import com.onsen.domain.Location;
import com.onsen.domain.WorldState;
import com.onsen.event.EventType;
import com.onsen.event.StoryEvent;
import org.springframework.stereotype.Component;

import java.util.Random;

@Component
public class StateEvaluator {

    private final Random random = new Random();

    public void applyEvent(StoryEvent event, WorldState state) {

        EventType type = event.getType();

        switch (type) {

            case ENTER_HOT_SPRING -> {
                state.decreaseSanity(5);
                // 15% chance to get injured when entering hot spring
                if (!state.isBleeding() && random.nextDouble() < 0.15) {
                    state.markBleeding();
                    state.decreaseSanity(20);
                    state.setJustGotInjured(true);
                }
            }

            case ENTER_COLD_SPRING -> {
                state.decreaseSanity(2);
                state.decreaseExposure(1);
                // 10% chance to get injured when entering cold spring
                if (!state.isBleeding() && random.nextDouble() < 0.10) {
                    state.markBleeding();
                    state.decreaseSanity(20);
                    state.setJustGotInjured(true);
                }
                // 冷泉可以增加 SAN
                if (state.getSanity() >= 25 && state.getSanity() < 80) {
                    state.increaseSanity(15);
                }
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

        // Check if player should randomly attack visitor when SAN is low
        checkRandomAttack(state, type);

        resolveEnding(state);
    }

    /**
     * Check if sanity is critically low and trigger staff intervention
     */
    private void checkCriticalSanity(WorldState state, EventType currentEvent) {
        // If SAN drops below 20 and we're not already being guided, trigger
        // STAFF_GUIDANCE
        if (state.getSanity() < 20 &&
                currentEvent != EventType.STAFF_GUIDANCE &&
                state.getCurrentLocation() != Location.SHARK_POOL) {
            // This will be handled by the game engine to send STAFF_GUIDANCE event
            state.setRequiresStaffGuidance(true);
        }
    }

    /**
     * Check if player should randomly attack a visitor when SAN is low
     */
    private void checkRandomAttack(WorldState state, EventType currentEvent) {
        // When SAN < 30 and not already attacked, 25% chance to attack on any action
        if (state.getSanity() < 30 &&
                !state.isAttackedVisitor() &&
                currentEvent != EventType.ATTACKED_VISITOR &&
                currentEvent != EventType.STAFF_GUIDANCE &&
                state.getCurrentLocation() != Location.SHARK_POOL &&
                state.getCurrentLocation() != Location.HOME) {

            // 25% chance to lose control and attack
            if (random.nextDouble() < 0.25) {
                state.markAttackedVisitor();
                state.decreaseSanity(30);
                state.setShouldAttackVisitor(true);
            }
        }
    }

    private void resolveEnding(WorldState state) {

        // Skip ending checks if player is still at HOME (game hasn't really started
        // yet)
        if (state.getCurrentLocation() == Location.HOME) {
            state.setEnding(EndingStatus.NONE);
            return;
        }

        // True Endings
        if (state.getSanity() < 10 && state.getCurrentLocation() == Location.SHARK_POOL) {
            state.setEnding(EndingStatus.END_ASSIMILATION);
            return;
        }

        // Eaten Ending
        if (state.getCurrentLocation() == Location.SHARK_POOL &&
                (state.isBleeding() || state.isAttackedVisitor())) {
            state.setEnding(EndingStatus.END_DISPOSAL);
            return;
        }

        // Survival Loops (only check when player is trying to leave from ENTRANCE)

        // Survival Loop A:
        // Player noticed something scary and leaves quickly, but should have visited
        // first
        if (state.isNoticedFin() &&
                state.getSanity() < 50 &&
                state.getCurrentLocation() == Location.ENTRANCE &&
                (state.hasVisited(Location.HOT_SPRING) || state.hasVisited(Location.COLD_SPRING))) {
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
        // Player must have visited at least one hot spring before they can "leave"
        if (!state.isNoticedFin() &&
                state.getSanity() >= 80 &&
                state.getExposureLevel() == 0 &&
                state.getCurrentLocation() == Location.ENTRANCE &&
                (state.hasVisited(Location.HOT_SPRING) || state.hasVisited(Location.COLD_SPRING))) {
            state.setEnding(EndingStatus.SURVIVE_LOOP_C);
            return;
        }

        // === Game Continues ===
        // If none of the above conditions are met, keep NONE state, player can continue
        // the game
        // For example: SAN = 60, in HOT_SPRING, no fin seen -> continue playing
        if (state.getEnding() != EndingStatus.NONE) {
            // If there is already an ending, do not overwrite
            // This protection logic ensures that the ending will not be accidentally
            // cleared
            return;
        }

        // Explicitly keep the game in progress state
        state.setEnding(EndingStatus.NONE);
    }
}
