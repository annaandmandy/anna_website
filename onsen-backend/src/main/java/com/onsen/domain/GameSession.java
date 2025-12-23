package com.onsen.domain;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class GameSession {
    private String sessionId;
    private String playerId;
    private WorldState worldState;
    private List<String> eventHistory;
    private Instant createdAt;
    private Instant lastUpdatedAt;
    
    public GameSession() {
        this.sessionId = UUID.randomUUID().toString();
        this.worldState = new WorldState();
        this.eventHistory = new ArrayList<>();
        this.createdAt = Instant.now();
        this.lastUpdatedAt = Instant.now();
    }
    
    public GameSession(String playerId) {
        this();
        this.playerId = playerId;
    }
    
    public void addEvent(String eventDescription) {
        this.eventHistory.add(eventDescription);
        this.lastUpdatedAt = Instant.now();
    }
    
    public void updateState() {
        this.lastUpdatedAt = Instant.now();
    }

    // Getters and Setters
    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getPlayerId() {
        return playerId;
    }

    public void setPlayerId(String playerId) {
        this.playerId = playerId;
    }

    public WorldState getWorldState() {
        return worldState;
    }

    public void setWorldState(WorldState worldState) {
        this.worldState = worldState;
    }

    public List<String> getEventHistory() {
        return eventHistory;
    }

    public void setEventHistory(List<String> eventHistory) {
        this.eventHistory = eventHistory;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getLastUpdatedAt() {
        return lastUpdatedAt;
    }

    public void setLastUpdatedAt(Instant lastUpdatedAt) {
        this.lastUpdatedAt = lastUpdatedAt;
    }
}
