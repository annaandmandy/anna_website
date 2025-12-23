# Loop Flow - No More Conflicts! ✅

## The Problem (Before)
```
SURVIVE_LOOP_A Ending:
├─ Player escapes facility
├─ "I wake up at home..."          ← Showed home scene
├─ Mother: "How was it?"            ← Showed conversation
└─ Me: "No... don't want to go..."  ← Ended here

THEN game continues...

HOME location (loop_1):
├─ "Morning light..."               ← DUPLICATE home scene!
├─ Mother: "You're awake?"          ← DUPLICATE conversation!
└─ Me: "Why does this feel familiar?" ← CONFLICT!
```

## The Solution (Now)
```
SURVIVE_LOOP_A Ending:
├─ Player escapes facility
├─ "I run. My heart pounds..."
├─ "My hands are shaking..."
├─ "The world fades to black."
└─ END SCENE HERE ✅
    ↓
    Game continues to next loop
    ↓
HOME location (loop_1):
├─ "Morning light filters through..."    ← No conflict!
├─ Mother: "You're awake already?"       ← New conversation
├─ Me: "Why does this feel familiar?"   ← Loop awareness
└─ Mother: "Visit the hot spring again?" ← The loop continues...
```

## Flow Chart

```
┌─────────────────────────────────────────────────┐
│           GAME START (First Visit)              │
│  HOME (default) → ENTRANCE → HOT_SPRING → ...  │
└─────────────────────────────────────────────────┘
                        ↓
                 [Player Actions]
                        ↓
        ┌───────────────┴───────────────┐
        │                               │
   [Bad Ending]                  [Survive Loop]
        │                               │
        ↓                               ↓
┌───────────────┐              ┌────────────────┐
│ END_DISPOSAL  │              │ SURVIVE_LOOP_A │
│ or            │              │ SURVIVE_LOOP_B │
│ ASSIMILATION  │              │ SURVIVE_LOOP_C │
└───────────────┘              └────────────────┘
        │                               │
        ↓                               ↓
   GAME OVER                    "Fades to black"
   (No loop)                            │
                                        ↓
                               ┌────────────────┐
                               │  NEXT LOOP     │
                               │  HOME (loop_1) │
                               └────────────────┘
                                        │
                                        ↓
                        Wakes up at home with deja vu
                        Mother suggests hot spring again
                        Loop continues...
```

## Ending Summaries

### SURVIVE_LOOP_A: Panicked Escape
**Ends at:** Player's vision fades after running away
**Mental State:** Traumatized
**Continues to loop:** ✅ Yes
**Next scene:** HOME (loop_1) - wakes up traumatized

**Final lines:**
- "My hands are shaking. My vision blurs."
- "The world fades to black."
- "You escaped… but at what cost?"

---

### SURVIVE_LOOP_B: Rational Response
**Ends at:** Player leaves facility calmly
**Mental State:** Rational
**Continues to loop:** ✅ Yes
**Next scene:** HOME (loop_1) - wakes up but remembers

**Final lines:**
- "I walk out. The door closes behind me."
- "(I won't come back. And I'll never tell anyone what I saw.)"
- "Reason triumphed over fear."

---

### SURVIVE_LOOP_C: Perfect Visit
**Ends at:** Player leaves, unaware of anything wrong
**Mental State:** Blissfully Unaware
**Continues to loop:** ✅ Yes  
**Next scene:** HOME (loop_1) - wakes up wanting to go again

**Final lines:**
- "(I should come back next week.)"
- "Ignorance is bliss."
- "…Or is it?"

---

### END_DISPOSAL: Rule Violation
**Ends at:** Death in shark pool
**Mental State:** Deceased
**Continues to loop:** ❌ No
**Next scene:** GAME OVER

---

### END_ASSIMILATION: Complete Transformation
**Ends at:** Becomes part of the pool
**Mental State:** Transformed
**Continues to loop:** ❌ No
**Next scene:** GAME OVER (but you become an NPC!)

---

## Implementation Note

In the backend, when a SURVIVE_LOOP ending triggers:

1. **Display the ending dialogue** (escape/leave scene)
2. **Set `continues_to_loop: true`**
3. **Backend increments `loopCount`**
4. **Game state resets to HOME**
5. **HOME location checks `loopCount > 0`**
6. **If yes, use `loop_1` variant instead of `default`**

This way:
- Endings don't duplicate the home scene
- HOME location handles all "waking up" narratives
- Loop progression feels natural
- No narrative conflicts! ✅

---

## Stats Key

All endings now have:
```json
"stats": {
  "discovery": true/false,        // Did player see the truth?
  "survival": true/false,          // Did player physically survive?
  "mental_state": "...",           // Player's psychological state
  "continues_to_loop": true/false  // Does game continue to next loop?
}
```

This allows the backend to properly route the next scene! 🎮
