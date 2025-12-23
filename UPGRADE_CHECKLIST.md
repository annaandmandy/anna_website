# Onsen Game - Upgrade Checklist

Based on the "Onsen遊戲修復計劃書.docx" analysis document.

---

## 🔴 Priority 0 (Critical - Blocking Issues)

### ✅ P0: WebSocket Connection Issues - FIXED
- ✅ CORS configuration completed in `WebConfig.java`
- ✅ WebSocket endpoints properly configured
- ✅ Frontend can establish connection

### ✅ P2: WebSocket Controller Implementation - FIXED
- ✅ Created `GameWebSocketController.java`
- ✅ Handles `/app/action` messages
- ✅ Converts player actions to game events
- ✅ Error handling implemented
- ✅ Added `sendError()` method to `WebSocketService`

### 🔧 P3: GameState Initialization
**Status:** Needs Implementation
**Issue:** Initial game state is null, frontend shows default values instead of actual state
**Root Cause:** `GameEngine.startGame()` doesn't send initial state via WebSocket

**Tasks:**
- [ ] Modify `GameEngine.startGame()` to send initial state immediately after session creation
- [ ] Use `WebSocketService.sendStateUpdate()` to push complete `WorldState`
- [ ] Send `GAME_START` scene narrative
- [ ] Ensure frontend receives complete state data at game start

**Files to Modify:**
- `onsen-backend/src/main/java/com/onsen/service/GameEngine.java`

---

## 🟠 Priority 1 (High - Major Features)

### 🔧 P4: Choice System Refactoring
**Status:** Incomplete
**Issue:** `getAvailableChoices()` data structure doesn't match frontend `ChoicePanel` expectations
**Root Cause:** Frontend-backend Choice object definitions are inconsistent

**Tasks:**

**Frontend (`frontend/src/pages/RuleBasedGame.jsx`):**
- [ ] Implement dynamic choice generation based on `gameState.currentLocation`
- [ ] Use Choice structure: `{ id: string, text: string, disabled: boolean }`
- [ ] Define location-specific available actions
- [ ] Handle special cases (e.g., no choices during endings)

**Backend (`onsen-backend/src/main/java/com/onsen/service/SceneManager.java`):**
- [ ] Provide reference `getAvailableChoices()` method
- [ ] Focus on validating action legality (actual generation happens on frontend)

### 🔧 Ending Logic Optimization
**Status:** Needs Refinement
**Tasks:**
- [ ] Modify `StateEvaluator.resolveEnding()`:
  - [ ] Add ending protection: don't overwrite existing endings
  - [ ] Survival Loop only triggers at ENTRANCE location (player actively leaves)
  - [ ] Stricter True Ending conditions
  - [ ] Clear distinction between "game continues" and "ending triggered"

**Ending Types to Verify:**
- `END_ASSIMILATION`: SAN < 10 at SHARK_POOL
- `END_DISPOSAL`: Bleeding or attacked visitor at SHARK_POOL
- `SURVIVE_LOOP_A`: Discovered anomaly + SAN < 50
- `SURVIVE_LOOP_B`: Used cold spring + SAN >= 70
- `SURVIVE_LOOP_C`: Perfect run (no discoveries + SAN >= 80)

**Files to Modify:**
- `onsen-backend/src/main/java/com/onsen/state/StateEvaluator.java`

### 🔧 Integration Testing
**Status:** Not Started
**Tasks:**
- [ ] Test complete game flow end-to-end
- [ ] Verify all 5 ending scenarios
- [ ] Bug fixing based on test results

---

## 🟡 Priority 2 (Medium - Enhancements)

### ✅ P1: Rules System - PARTIALLY COMPLETE
**Current Status:**
- ✅ `RuleController` implemented with `/api/rules/current` endpoint
- ✅ `RuleLoader` uses ClassPathResource for proper resource loading
- ✅ Rules directory moved to `src/main/resources/rules`
- ✅ Docker compatibility fixed

**Remaining Tasks:**
- [ ] Implement complete Rule Display Mechanism:
  - [ ] `GameEngine.processAction()` checks if rules should be displayed after processing events
  - [ ] Call `RuleEvaluator.shouldShowRule()` for evaluation
  - [ ] Use `WebSocketService.sendRuleNotification()` to push to frontend
  - [ ] Mark rules as read to avoid duplication

**Frontend Tasks:**
- [ ] Verify `RuleModal` component works with backend integration
- [ ] Test 3-second forced reading time
- [ ] Verify flicker animation effect
- [ ] Support both array and string formats for rule content

**Files to Modify:**
- `onsen-backend/src/main/java/com/onsen/service/GameEngine.java`
- `frontend/src/components/RuleModal.jsx` (verify existing implementation)

---

## 📦 Dependencies & Setup

### Frontend Dependencies
- [ ] Install WebSocket libraries:
  ```bash
  cd frontend
  npm install sockjs-client @stomp/stompjs
  ```

### Backend Dependencies
- ✅ All dependencies already configured in `pom.xml`

---

## 🚀 Deployment Steps

### Docker Environment
1. ✅ Start Docker containers (Already done)
   ```bash
   cd onsen-backend
   docker-compose up -d
   ```
2. ✅ Wait for services to be ready (Kafka, Redis, Backend)

### Frontend Development Server
```bash
cd frontend
npm install
npm run dev
# Access: http://localhost:5173
```

---

## 🧪 Testing Plan

### Unit Tests (Not Started)

**Backend Tests:**
- [ ] `StateEvaluator.applyEvent()` - verify each event correctly changes state
- [ ] `StateEvaluator.resolveEnding()` - test all ending trigger conditions
- [ ] `RuleEvaluator.shouldShowRule()` - verify rule display logic
- [ ] `SessionService` - Redis read/write operations

**Frontend Tests:**
- [ ] `useWebSocket` hook - connection, disconnection, reconnection logic
- [ ] `getAvailableChoices()` - choice correctness for each location
- [ ] Component rendering tests (TextBox, ChoicePanel, RuleModal)

### Integration Tests

| Test Scenario | Steps | Expected Result | Status |
|---------------|-------|-----------------|--------|
| Perfect Clear | Follow all rules, don't stay too long, don't observe | Trigger `SURVIVE_LOOP_C` | ⬜ Not Tested |
| Panic Escape | LOOK_AROUND see fin, SAN < 50, leave | Trigger `SURVIVE_LOOP_A` | ⬜ Not Tested |
| Calm Response | Use cold spring to recover SAN, maintain >= 70, leave | Trigger `SURVIVE_LOOP_B` | ⬜ Not Tested |
| Disposal Ending | Bleed or attack visitor, then enter SHARK_POOL | Trigger `END_DISPOSAL` | ⬜ Not Tested |
| Assimilation Ending | SAN < 10, enter SHARK_POOL | Trigger `END_ASSIMILATION` | ⬜ Not Tested |

### Performance Tests (Not Started)

**Target Metrics:**
- [ ] WebSocket connection latency < 100ms
- [ ] Action response time < 200ms
- [ ] Redis read/write latency < 10ms
- [ ] Kafka message send latency < 50ms
- [ ] Support 100 concurrent sessions

---

## 📋 Implementation Phases

### Phase 1: WebSocket Infrastructure (2 hours)
- ✅ Implement WebSocket Hook and Controller - **COMPLETED**

### Phase 2: GameState Initialization (1 hour)
- 🔧 **IN PROGRESS** - Need to implement initial state sending

### Phase 3: Choice System Refactoring (1.5 hours)
- 🔧 **PENDING**

### Phase 4: Ending Logic Optimization (1 hour)
- 🔧 **PENDING**

### Phase 5: Rule Display Mechanism (1 hour)
- 🔲 **PENDING** - API endpoint ready, need integration

### Phase 6: Integration Testing & Bug Fixes (2 hours)
- 🔲 **NOT STARTED**

**Total Estimated Time:** 8.5 hours
**Completed:** ~2.5 hours (Phase 1 + partial setup fixes)
**Remaining:** ~6 hours

---

## 🎯 Key Success Criteria

✅ Frontend-Backend WebSocket communication established
✅ CORS and connectivity issues resolved
⬜ Complete game state management flow
⬜ Player actions and choice system working properly
⬜ Correct ending trigger logic
⬜ Rule paper display mechanism perfected

---

## 🔮 Future Enhancements (Post-MVP)

- [ ] Add more game content (events, ending branches)
- [ ] Improve UI/UX design (animations, sound effects)
- [ ] Implement save/load functionality
- [ ] Add multi-language support (i18n)
- [ ] Performance optimization & stress testing
- [ ] Achievement system
- [ ] Player statistics and analytics

---

## 📁 File Reference

### New Files Created
- ✅ `onsen-backend/src/main/java/com/onsen/api/GameWebSocketController.java`
- ⬜ `frontend/src/hooks/useWebSocket.js` (needs creation)

### Files to Modify
**Frontend:**
- `frontend/src/pages/RuleBasedGame.jsx` - getAvailableChoices() method
- `frontend/package.json` - add dependencies
- `frontend/src/hooks/useWebSocket.js` - create new hook

**Backend:**
- `onsen-backend/src/main/java/com/onsen/service/GameEngine.java`
  - `startGame()` - add initial state push
  - `processAction()` - add rule checking
- `onsen-backend/src/main/java/com/onsen/state/StateEvaluator.java`
  - `resolveEnding()` - optimize ending logic
- `onsen-backend/src/main/java/com/onsen/service/SceneManager.java`
  - `getAvailableChoices()` - provide reference implementation

---

**Last Updated:** 2025-12-23
**Document Status:** Active Development
