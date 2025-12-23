package com.onsen.domain;

import com.onsen.event.EventType;

import java.util.HashMap;
import java.util.Map;

public class PlayerAction {
    private EventType action;
    private String sessionId;
    private Map<String, Object> metadata;
    
    public PlayerAction() {
        this.metadata = new HashMap<>();
    }
    
    public PlayerAction(EventType action, String sessionId) {
        this();
        this.action = action;
        this.sessionId = sessionId;
    }

    public EventType getAction() {
        return action;
    }

    public void setAction(EventType action) {
        this.action = action;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public Map<String, Object> getMetadata() {
        return metadata;
    }

    public void setMetadata(Map<String, Object> metadata) {
        this.metadata = metadata;
    }
}
