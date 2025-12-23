package com.onsen.state;

import com.onsen.domain.EndingStatus;
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

            case NOTICE_FLAG -> {
                state.decreaseSanity(8);
            }

            case ENTER_COLD_SPRING -> {
                state.decreaseSanity(2);
                state.increaseExposure(-1);
            }

            case INJURED -> {
                state.markInjured();
                state.decreaseSanity(20);
            }

            case STAFF_GUIDANCE -> {
                state.decreaseSanity(5);
            }
        }

        resolveEnding(state);
    }

    private void resolveEnding(WorldState state) {

        if (state.isInjured() && state.getExposureLevel() >= 3) {
            state.setEnding(EndingStatus.LOOP_3);
            return;
        }

        if (state.getSanity() <= 0) {
            state.setEnding(EndingStatus.LOOP_2);
            return;
        }

        if (state.getExposureLevel() >= 5) {
            state.setEnding(EndingStatus.LOOP_1);
        }
    }
}
