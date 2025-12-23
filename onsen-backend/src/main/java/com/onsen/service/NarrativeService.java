package com.onsen.service;

import com.onsen.domain.Location;
import com.onsen.event.EventType;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NarrativeService {

    /**
     * Get narrative lines for specific events.
     * Returns all lines immediately - frontend handles pacing and timing.
     */
    public List<String> getNarrativeLines(EventType event, Location location, int sanity) {
        return switch (event) {
            case STAY_TOO_LONG -> List.of(
                    "I decide to stay longer. The warmth is... comforting.",
                    "The water temperature seems to be rising.",
                    "I feel something watching me from beneath the surface.");

            case LOOK_AROUND -> {
                if (sanity < 80) {
                    yield List.of(
                            "I slowly turn my head, scanning the room.",
                            "Most visitors seem normal, but...",
                            "Wait. What was that in the water?",
                            "A dark fin breaks the surface for just a moment.");
                } else {
                    yield List.of(
                            "I look around. Everything seems peaceful.",
                            "Other guests are relaxing quietly.");
                }
            }

            case ENTER_HOT_SPRING -> List.of(
                    "I step into the hot spring.",
                    "The heat envelops me. It feels good.",
                    "I notice a faint smell... metallic?");

            case ENTER_COLD_SPRING -> List.of(
                    "I move to the cold spring section.",
                    "The shock of cold water clears my mind.",
                    "I feel more in control now.");

            case INJURED -> List.of(
                    "Pain shoots through me. I'm bleeding.",
                    "The water around me darkens with blood.",
                    "I see shapes moving toward me beneath the surface.",
                    "They're... circling.");

            default -> List.of(
                    getImmediateNarrative(event, location));
        };
    }

    private String getImmediateNarrative(EventType event, Location location) {
        return switch (event) {
            case GAME_START -> "I wake up feeling uneasy. Mother insists I visit the hot spring.";
            case LEAVE_FACILITY -> "I decide to leave. Something doesn't feel right here.";
            case ENTER_SHARK_POOL -> "A staff member leads me to a private pool. 'Our premium experience,' they say.";
            default -> "";
        };
    }
}
