package com.onsen.kafka;

import com.onsen.domain.WorldState;
import com.onsen.event.StoryEvent;
import com.onsen.state.StateEvaluator;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class EventConsumer {

    private final ObjectMapper objectMapper;
    private final StateEvaluator stateEvaluator;

    public EventConsumer(StateEvaluator stateEvaluator) {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
        this.stateEvaluator = stateEvaluator;
    }

    @KafkaListener(topics = "story-events", groupId = "onsen-backend")
    public void consume(String message) {
        try {
            StoryEvent event = objectMapper.readValue(message, StoryEvent.class);

            System.out.println("Received event from Kafka: " + event);
            
            // TODO: Get WorldState from session/storage
            WorldState worldState = new WorldState();
            stateEvaluator.applyEvent(event, worldState);
            System.out.println("Updated world state: sanity=" + worldState.getSanity() + ", exposure=" + worldState.getExposureLevel());

        } catch (Exception e) {
            System.err.println("Failed to parse event: " + message);
            e.printStackTrace();
        }
    }
}
