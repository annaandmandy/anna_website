package com.onsen.service;

import com.onsen.domain.GameSession;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;

@Service
public class SessionService {

    private static final String SESSION_KEY_PREFIX = "game:session:";
    private static final Duration SESSION_TTL = Duration.ofMinutes(30);
    
    private final RedisTemplate<String, Object> redisTemplate;
    
    public SessionService(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }
    
    /**
     * Create a new game session
     */
    public GameSession createSession(String playerId) {
        GameSession session = new GameSession(playerId);
        // Override the auto-generated sessionId with the playerId
        // This allows frontend to control the session ID
        session.setSessionId(playerId);
        saveSession(session);
        return session;
    }
    
    /**
     * Save or update a game session
     */
    public void saveSession(GameSession session) {
        session.updateState();
        String key = getSessionKey(session.getSessionId());
        redisTemplate.opsForValue().set(key, session, SESSION_TTL);
    }
    
    /**
     * Get a game session by ID
     */
    public Optional<GameSession> getSession(String sessionId) {
        String key = getSessionKey(sessionId);
        GameSession session = (GameSession) redisTemplate.opsForValue().get(key);
        return Optional.ofNullable(session);
    }
    
    /**
     * Delete a game session
     */
    public void deleteSession(String sessionId) {
        String key = getSessionKey(sessionId);
        redisTemplate.delete(key);
    }
    
    /**
     * Check if a session exists
     */
    public boolean sessionExists(String sessionId) {
        String key = getSessionKey(sessionId);
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }
    
    /**
     * Extend session TTL
     */
    public void extendSession(String sessionId) {
        String key = getSessionKey(sessionId);
        redisTemplate.expire(key, SESSION_TTL);
    }
    
    private String getSessionKey(String sessionId) {
        return SESSION_KEY_PREFIX + sessionId;
    }
}
