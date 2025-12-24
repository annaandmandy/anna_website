package com.onsen.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.onsen.domain.EndingStatus;
import com.onsen.domain.Location;
import com.onsen.domain.WorldState;
import com.onsen.event.EventType;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class NarrativeService {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private JsonNode locations;
    private JsonNode events;
    private JsonNode endings;

    public NarrativeService() {
        loadNarratives();
    }

    private void loadNarratives() {
        try {
            locations = objectMapper.readTree(
                    new ClassPathResource("narratives/locations.json").getInputStream());
            events = objectMapper.readTree(
                    new ClassPathResource("narratives/events.json").getInputStream());
            endings = objectMapper.readTree(
                    new ClassPathResource("narratives/endings.json").getInputStream());
        } catch (IOException e) {
            throw new RuntimeException("Failed to load narrative files", e);
        }
    }

    /**
     * Get dialogue for a location based on game state
     */
    public List<DialogueLine> getLocationDialogue(Location location, WorldState state) {
        JsonNode locationNode = locations.get(location.name());
        if (locationNode == null) {
            return List.of();
        }

        // Determine which variant to use
        String variant = determineLocationVariant(state);

        JsonNode dialogueNode;
        if (locationNode.has(variant)) {
            dialogueNode = locationNode.get(variant).get("dialogue");
        } else if (locationNode.has("default")) {
            dialogueNode = locationNode.get("default").get("dialogue");
        } else {
            return List.of();
        }

        return parseDialogue(dialogueNode);
    }

    /**
     * Get dialogue for an event
     */
    public List<DialogueLine> getEventDialogue(EventType eventType, WorldState state) {
        System.out.println("[NarrativeService] getEventDialogue - EventType: " + eventType.name());

        JsonNode eventNode = events.get(eventType.name());
        if (eventNode == null) {
            System.out.println("[NarrativeService] ERROR: No event node found for: " + eventType.name());
            return List.of();
        }

        System.out.println("[NarrativeService] Event node found for: " + eventType.name());

        // Determine which variant to use based on state
        String variant = determineEventVariant(eventType, state);
        System.out.println("[NarrativeService] Using variant: " + variant);

        JsonNode dialogueNode;
        if (eventNode.has(variant)) {
            System.out.println("[NarrativeService] Found variant dialogue for: " + variant);
            dialogueNode = eventNode.get(variant).get("dialogue");
        } else if (eventNode.has("dialogue")) {
            // Direct dialogue array
            System.out.println("[NarrativeService] Using direct dialogue (no variants)");
            dialogueNode = eventNode.get("dialogue");
        } else {
            System.out.println("[NarrativeService] ERROR: No dialogue found for event: " + eventType.name());
            return List.of();
        }

        List<DialogueLine> result = parseDialogue(dialogueNode);
        System.out.println("[NarrativeService] Parsed " + result.size() + " dialogue lines");
        return result;
    }

    /**
     * Get ending dialogue
     */
    public EndingNarrative getEndingDialogue(EndingStatus ending) {
        JsonNode endingNode = endings.get(ending.name());
        if (endingNode == null) {
            return new EndingNarrative("Unknown Ending", List.of(), "", null);
        }

        String title = endingNode.get("title").asText();
        List<DialogueLine> dialogue = parseDialogue(endingNode.get("dialogue"));
        String epilogue = endingNode.get("epilogue").asText();

        // Parse stats if present
        JsonNode statsNode = endingNode.get("stats");
        EndingStats stats = null;
        if (statsNode != null) {
            stats = new EndingStats(
                    statsNode.has("discovery") ? statsNode.get("discovery").asBoolean() : false,
                    statsNode.get("survival").asBoolean(),
                    statsNode.get("mental_state").asText(),
                    statsNode.has("continues_to_loop") && statsNode.get("continues_to_loop").asBoolean());
        }

        return new EndingNarrative(title, dialogue, epilogue, stats);
    }

    /**
     * Determine which location variant to show based on game state
     */
    private String determineLocationVariant(WorldState state) {
        // Check for specific conditions first
        if (state.getCurrentLocation() == Location.HOT_SPRING) {
            if (state.isNoticedFin()) {
                return "noticed_fin";
            }
            if (state.getSanity() < 30) {
                return "sanity_low";
            }
            // Check if stayed longer
            if (state.getExposureLevel() > 1) {
                return "stay_longer";
            }
        }

        if (state.getCurrentLocation() == Location.COLD_SPRING) {
            if (state.getSanity() < 50) {
                return "panic_recovery";
            }
            if (state.getExposureLevel() > 0) {
                return "stay_longer";
            }
        }

        if (state.getCurrentLocation() == Location.SHARK_POOL) {
            if (state.isBleeding()) {
                return "bleeding";
            }
        }

        if (state.getCurrentLocation() == Location.HOME) {
            if (state.getLoopCount() > 0) {
                // Determine which loop variant based on previous ending
                EndingStatus lastEnding = state.getEnding();
                if (lastEnding == EndingStatus.SURVIVE_LOOP_A) {
                    return "after_loop_a";
                } else if (lastEnding == EndingStatus.SURVIVE_LOOP_B) {
                    return "after_loop_b";
                } else if (lastEnding == EndingStatus.SURVIVE_LOOP_C) {
                    return "after_loop_c";
                }
                return "loop_1";
            }
        }

        if (state.getCurrentLocation() == Location.ENTRANCE) {
            if (state.getLoopCount() > 0) {
                return "after_loop";
            }
        }

        return "default";
    }

    /**
     * Determine which event variant to show
     */
    private String determineEventVariant(EventType eventType, WorldState state) {
        switch (eventType) {
            case ENTER_HOT_SPRING:
                return state.getLoopCount() == 0 ? "first_time" : "repeated";

            case LOOK_AROUND:
                // Probability of noticing the fin based on sanity
                if (state.getSanity() < 70 && !state.isNoticedFin()) {
                    return "notice_fin";
                }
                return "safe";

            case STAY_TOO_LONG:
                return state.getExposureLevel() > 2 ? "danger" : "warning";

            case ENTER_COLD_SPRING:
                return state.getSanity() < 50 ? "panic" : "normal";

            case LEAVE_FACILITY:
                return state.getSanity() < 40 ? "panic" : "normal";

            default:
                return "default";
        }
    }

    /**
     * Parse dialogue array from JSON
     */
    private List<DialogueLine> parseDialogue(JsonNode dialogueArray) {
        List<DialogueLine> lines = new ArrayList<>();
        if (dialogueArray == null || !dialogueArray.isArray()) {
            return lines;
        }

        for (JsonNode lineNode : dialogueArray) {
            String speaker = lineNode.get("speaker").asText();
            String text = lineNode.get("text").asText();
            String emotion = lineNode.has("emotion") ? lineNode.get("emotion").asText() : null;

            lines.add(new DialogueLine(speaker, text, emotion));
        }

        return lines;
    }

    // DTOs
    public record DialogueLine(String speaker, String text, String emotion) {
    }

    public record EndingNarrative(
            String title,
            List<DialogueLine> dialogue,
            String epilogue,
            EndingStats stats) {
    }

    public record EndingStats(
            boolean discovery,
            boolean survival,
            String mentalState,
            boolean continuesToLoop) {
    }
}
