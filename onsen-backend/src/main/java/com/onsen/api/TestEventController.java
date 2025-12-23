package com.onsen.api;

import com.onsen.event.EventType;
import com.onsen.event.StoryEvent;
import com.onsen.kafka.EventProducer;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class TestEventController {

    private final EventProducer producer;

    public TestEventController(EventProducer producer) {
        this.producer = producer;
    }

    @GetMapping("/api/test/event")
    public String testEvent() {
        StoryEvent event = new StoryEvent(
                EventType.ENTER_HOT_SPRING,
                Map.of("location", "hot_spring")
        );
        producer.publish(event);
        return "Event sent";
    }
}
