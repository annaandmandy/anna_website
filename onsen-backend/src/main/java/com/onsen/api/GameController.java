package com.onsen.api;

import com.onsen.domain.GameSession;
import com.onsen.domain.PlayerAction;
import com.onsen.service.GameEngine;
import com.onsen.service.SceneManager;
import com.onsen.service.SessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/game")
public class GameController {

    private final GameEngine gameEngine;
    private final SceneManager sceneManager;
    private final SessionService sessionService;
    
    public GameController(GameEngine gameEngine, SceneManager sceneManager, SessionService sessionService) {
        this.gameEngine = gameEngine;
        this.sceneManager = sceneManager;
        this.sessionService = sessionService;
    }
    
    /**
     * Start a new game
     */
    @PostMapping("/start")
    public ResponseEntity<GameResponse> startGame(@RequestBody StartGameRequest request) {
        GameSession session = gameEngine.startGame(request.playerId());
        
        Map<String, Object> scene = sceneManager.getCurrentScene(session);
        var choices = sceneManager.getAvailableChoices(session);
        
        return ResponseEntity.ok(new GameResponse(
            session.getSessionId(),
            scene,
            choices,
            session.getWorldState()
        ));
    }
    
    /**
     * Process a player action
     */
    @PostMapping("/action")
    public ResponseEntity<GameResponse> processAction(@RequestBody PlayerAction action) {
        return gameEngine.processAction(action)
            .map(session -> {
                Map<String, Object> scene = sceneManager.getCurrentScene(session);
                var choices = sceneManager.getAvailableChoices(session);
                
                return ResponseEntity.ok(new GameResponse(
                    session.getSessionId(),
                    scene,
                    choices,
                    session.getWorldState()
                ));
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Get current game state
     */
    @GetMapping("/{sessionId}/state")
    public ResponseEntity<GameResponse> getGameState(@PathVariable String sessionId) {
        return sessionService.getSession(sessionId)
            .map(session -> {
                Map<String, Object> scene = sceneManager.getCurrentScene(session);
                var choices = sceneManager.getAvailableChoices(session);
                
                return ResponseEntity.ok(new GameResponse(
                    session.getSessionId(),
                    scene,
                    choices,
                    session.getWorldState()
                ));
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    // DTOs
    record StartGameRequest(String playerId) {}
    
    record GameResponse(
        String sessionId,
        Map<String, Object> scene,
        Object choices,
        Object worldState
    ) {}
}
