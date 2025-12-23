package com.onsen.event;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

public class StoryEvent {
    private String eventId;
    private EventType type;
    private Map<String, Object> payload;
    private Instant timestamp;

    // Default constructor for Jackson
    public StoryEvent() {
    }

    @JsonCreator
    public StoryEvent(
        @JsonProperty("type") EventType type,
        @JsonProperty("payload") Map<String, Object> payload
    ) {
        this.eventId = UUID.randomUUID().toString();
        this.type = type;
        this.payload = payload;
        this.timestamp = Instant.now();
    }

    public String getEventId() {
        return eventId;
    }

    public EventType getType() {
        return type;
    }

    public Map<String, Object> getPayload() {
        return payload;
    }

    public Instant getTimestamp() {
        return timestamp;
    }
}
