package com.onsen.api;

import com.onsen.domain.GameSession;
import com.onsen.service.SessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/session")
public class SessionController {

    private final SessionService sessionService;
    
    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }
    
    /**
     * Create a new game session
     */
    @PostMapping("/create")
    public ResponseEntity<SessionResponse> createSession(@RequestBody CreateSessionRequest request) {
        GameSession session = sessionService.createSession(request.playerId());
        return ResponseEntity.ok(new SessionResponse(
            session.getSessionId(),
            session.getPlayerId(),
            session.getWorldState(),
            "Session created successfully"
        ));
    }
    
    /**
     * Get session details
     */
    @GetMapping("/{sessionId}")
    public ResponseEntity<SessionResponse> getSession(@PathVariable String sessionId) {
        return sessionService.getSession(sessionId)
            .map(session -> ResponseEntity.ok(new SessionResponse(
                session.getSessionId(),
                session.getPlayerId(),
                session.getWorldState(),
                "Session found"
            )))
            .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Delete a session
     */
    @DeleteMapping("/{sessionId}")
    public ResponseEntity<String> deleteSession(@PathVariable String sessionId) {
        sessionService.deleteSession(sessionId);
        return ResponseEntity.ok("Session deleted");
    }
    
    // Request/Response DTOs
    record CreateSessionRequest(String playerId) {}
    
    record SessionResponse(
        String sessionId,
        String playerId,
        Object worldState,
        String message
    ) {}
}
