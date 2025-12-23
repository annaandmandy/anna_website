# Onsen Game - 遊戲文本管理指南

本文檔說明如何添加和管理遊戲文本，以及控制文本顯示時機。

---

## 📁 文本組織架構

### 方案一：使用 JSON 配置文件（推薦）✅

**優點：**
- 易於編輯和維護
- 支援多語言
- 可以熱更新（不需重新編譯）
- 結構化數據，易於版本控制

**檔案結構：**
```
onsen-backend/src/main/resources/
├── narratives/
│   ├── locations.json       # 地點相關文本
│   ├── events.json          # 事件觸發文本
│   ├── endings.json         # 結局文本
│   └── system.json          # 系統訊息
└── rules/
    ├── paper1/rules.md
    ├── paper2/rules.md
    ├── paper3/rules.md
    └── paper4/rules.md
```

### 方案二：直接在 Java 代碼中（目前使用）

**缺點：**
- 每次修改需要重新編譯
- 難以維護大量文本
- 不支援多語言切換

**目前位置：**
`SceneManager.java` 中的 `getNarrative()` 和 `getEndingNarrative()` 方法

---

## 🎯 推薦方案：創建 JSON 文本配置

### 1. 地點文本配置 (locations.json)

```json
{
  "HOME": {
    "default": "我在家中醒來。母親建議我去溫泉放鬆一下。",
    "variants": {
      "loop_1": "又一次平常的早晨。母親又提起溫泉的事。",
      "loop_2": "這場景...似曾相識。母親說的話我好像聽過。"
    }
  },
  "ENTRANCE": {
    "default": "我抵達溫泉設施。入口處的告示牌上寫著入場規則。",
    "variants": {
      "first_visit": "這是我第一次來這裡。設施看起來很乾淨。",
      "return_visit": "我又回到這裡了。"
    }
  },
  "HOT_SPRING": {
    "default": "我浸入熱水中。水溫很舒適。其他訪客都在放鬆。",
    "conditions": {
      "noticedFin": "有什麼不對勁。我注意到蒸氣下有奇怪的形狀在移動...",
      "exposure_high": "水溫似乎比剛才更熱了。我感到有點暈眩。",
      "sanity_low": "水面的倒影看起來不太對。是我的錯覺嗎？"
    }
  },
  "COLD_SPRING": {
    "default": "冷水讓我震驚。我的思緒變得更清晰了。更穩定了。",
    "variants": {
      "panic_recovery": "冷水幫助我冷靜下來。恐慌感逐漸消退。",
      "strategic_use": "正如規則所說，冷泉確實有幫助。"
    }
  },
  "SHARK_POOL": {
    "default": "工作人員引導我到最熱的池子。水溫高得讓人不舒服。",
    "conditions": {
      "low_sanity": "我已經分不清現實和幻覺了。那些影子是...",
      "bleeding": "水因為我的血變得混濁。工作人員帶著奇怪的笑容看著我。"
    }
  }
}
```

### 2. 事件文本配置 (events.json)

```json
{
  "GAME_START": {
    "lines": [
      "歡迎來到溫泉設施",
      "請仔細閱讀規則",
      "祝您有個愉快的體驗"
    ]
  },
  "ENTER_HOT_SPRING": {
    "first_time": {
      "lines": [
        "我走進更衣室",
        "換上浴衣",
        "推開通往溫泉的門"
      ]
    },
    "repeated": {
      "lines": [
        "我再次進入溫泉區",
        "熟悉的蒸氣撲面而來"
      ]
    }
  },
  "LOOK_AROUND": {
    "default": {
      "lines": [
        "我仔細觀察周圍",
        "其他訪客看起來很正常",
        "但總覺得哪裡怪怪的..."
      ]
    },
    "notice_fin": {
      "lines": [
        "等等...那是什麼？",
        "水面下...有東西在移動",
        "那看起來像是...魚鰭？",
        "不，不可能。一定是錯覺。"
      ],
      "sanity_loss": 15
    }
  },
  "STAY_TOO_LONG": {
    "warning": {
      "lines": [
        "我已經泡了很久了",
        "開始感到頭暈",
        "也許該離開了..."
      ],
      "sanity_loss": 10
    },
    "danger": {
      "lines": [
        "時間...過了多久？",
        "我的視線開始模糊",
        "周圍的聲音聽起來不太對勁"
      ],
      "sanity_loss": 20
    }
  },
  "ENTER_COLD_SPRING": {
    "default": {
      "lines": [
        "我移動到冷泉區",
        "溫度的對比讓人清醒"
      ],
      "sanity_gain": 15
    },
    "panic_state": {
      "lines": [
        "我需要冷靜下來",
        "冷水...對，規則上說冷泉可以幫助",
        "深呼吸...好多了"
      ],
      "sanity_gain": 25
    }
  },
  "LEAVE_FACILITY": {
    "normal": {
      "lines": [
        "我決定離開",
        "在更衣室換回衣服",
        "走出溫泉設施"
      ]
    },
    "panic": {
      "lines": [
        "我必須馬上離開這裡",
        "顧不得禮儀，快速換好衣服",
        "沒有回頭就衝出大門"
      ]
    }
  },
  "NOTICE_FIN": {
    "lines": [
      "我的目光被某個東西吸引",
      "在熱氣中，我看見了",
      "那絕對不是人類的輪廓",
      "【理智值 -15】"
    ]
  },
  "INJURED": {
    "lines": [
      "糟糕，我不小心割傷了自己",
      "血滴進了水中",
      "工作人員注意到了這邊",
      "他們臉上的表情...有些異樣"
    ]
  },
  "ATTACKED_VISITOR": {
    "lines": [
      "我失控了",
      "對旁邊的訪客動了手",
      "周圍的人都停下來看著我",
      "工作人員正在靠近..."
    ]
  }
}
```

### 3. 結局文本配置 (endings.json)

```json
{
  "SURVIVE_LOOP_A": {
    "title": "結局 A：驚恐逃離",
    "narrative": [
      "我驚慌失措地逃離了設施",
      "當我在家中醒來時，這一切就像一場噩夢",
      "但...真的只是噩夢嗎？",
      "",
      "母親問我：「溫泉怎麼樣？要不要再去一次？」",
      "",
      "我顫抖著說不出話來。"
    ],
    "epilogue": "你注意到了異常，但理智值不足以冷靜應對。你活了下來，但心中留下了陰影。",
    "unlock_condition": "發現異常 + SAN < 50"
  },
  "SURVIVE_LOOP_B": {
    "title": "結局 B：冷靜應對",
    "narrative": [
      "冷泉的效果很明顯",
      "我的思緒恢復了清晰",
      "雖然看見了不該看的東西",
      "但我知道該如何安全離開",
      "",
      "回到家後，母親問起溫泉",
      "我平靜地回答：「還不錯，但我不會再去了。」"
    ],
    "epilogue": "你發現了真相，並利用規則中的提示保護了自己。這是理性的勝利。",
    "unlock_condition": "使用冷泉恢復 + SAN >= 70"
  },
  "SURVIVE_LOOP_C": {
    "title": "結局 C：完美通關",
    "narrative": [
      "我完美地遵守了所有規則",
      "沒有停留太久",
      "沒有四處張望",
      "沒有引起任何注意",
      "",
      "溫泉體驗很愉快",
      "什麼異常的事都沒發生",
      "",
      "母親問：「要不要下週再去？」",
      "我微笑著說：「好啊。」",
      "",
      "...真的什麼都沒發生嗎？"
    ],
    "epilogue": "無知即是福。你什麼都沒發現，或許這才是最好的結局。",
    "unlock_condition": "完美遵守規則 + SAN >= 80"
  },
  "END_DISPOSAL": {
    "title": "結局 D：規則違反者的下場",
    "narrative": [
      "工作人員帶著笑容走向我",
      "「讓我們為您引導到特別池。」",
      "",
      "水溫高得異常",
      "我想離開，但已經太遲了",
      "",
      "水面下的影子越來越近",
      "那些不是鯊魚",
      "是更古老、更可怕的東西",
      "",
      "我的尖叫淹沒在水聲中",
      "",
      "【遊戲結束】"
    ],
    "epilogue": "你違反了規則。流血或攻擊他人讓你標記為「不穩定」。設施不需要不穩定的訪客。",
    "unlock_condition": "流血或攻擊訪客 + 進入鯊魚池"
  },
  "END_ASSIMILATION": {
    "title": "結局 E：與深淵同化",
    "narrative": [
      "水很溫暖",
      "我感覺很舒服",
      "越來越舒服",
      "",
      "那些影子不再可怕",
      "它們在邀請我",
      "歡迎我",
      "",
      "我沉入水中",
      "不再需要呼吸",
      "不再需要思考",
      "",
      "我成為了它們的一部分",
      "",
      "這裡就是我的歸宿",
      "",
      "【真結局：完全同化】"
    ],
    "epilogue": "理智值歸零。你失去了人性，成為了溫泉設施的一部分。或許這也是一種「永恆」？",
    "unlock_condition": "SAN < 10 + 進入鯊魚池"
  }
}
```

### 4. 系統訊息配置 (system.json)

```json
{
  "notifications": {
    "sanity_low": "【警告】你的理智值過低！",
    "sanity_critical": "【危險】你快要失去自我了！",
    "sanity_recovered": "【恢復】你感覺好多了",
    "rule_shown": "【規則紙】請仔細閱讀",
    "ending_triggered": "【命運已定】"
  },
  "choices": {
    "confirm_leave": "確定要離開嗎？",
    "risky_action": "這個選擇可能很危險",
    "safe_action": "這似乎是安全的選擇"
  },
  "ui": {
    "loading": "載入中...",
    "connecting": "連接伺服器...",
    "error": "發生錯誤",
    "retry": "重試"
  }
}
```

---

## 🔧 實作步驟

### Step 1: 創建 JSON 文件

創建上述 JSON 文件到 `onsen-backend/src/main/resources/narratives/` 目錄下。

### Step 2: 創建 Java 服務讀取文本

創建 `NarrativeService.java`：

```java
package com.onsen.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class NarrativeService {
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    private JsonNode locations;
    private JsonNode events;
    private JsonNode endings;
    private JsonNode system;
    
    public NarrativeService() {
        loadNarratives();
    }
    
    private void loadNarratives() {
        try {
            locations = objectMapper.readTree(
                new ClassPathResource("narratives/locations.json").getInputStream()
            );
            events = objectMapper.readTree(
                new ClassPathResource("narratives/events.json").getInputStream()
            );
            endings = objectMapper.readTree(
                new ClassPathResource("narratives/endings.json").getInputStream()
            );
            system = objectMapper.readTree(
                new ClassPathResource("narratives/system.json").getInputStream()
            );
        } catch (IOException e) {
            throw new RuntimeException("Failed to load narrative files", e);
        }
    }
    
    /**
     * 根據地點和狀態獲取文本
     */
    public String getLocationNarrative(String location, WorldState state) {
        JsonNode locationNode = locations.get(location);
        
        // 檢查是否有條件變體
        if (locationNode.has("conditions")) {
            JsonNode conditions = locationNode.get("conditions");
            
            if (state.isNoticedFin() && conditions.has("noticedFin")) {
                return conditions.get("noticedFin").asText();
            }
            if (state.getSanity() < 30 && conditions.has("sanity_low")) {
                return conditions.get("sanity_low").asText();
            }
            // 添加更多條件檢查...
        }
        
        // 返回默認文本
        return locationNode.get("default").asText();
    }
    
    /**
     * 根據事件類型獲取敘事行
     */
    public List<String> getEventNarrative(String eventType, WorldState state) {
        JsonNode eventNode = events.get(eventType);
        List<String> lines = new ArrayList<>();
        
        // 根據條件選擇變體
        JsonNode selectedVariant = selectVariant(eventNode, state);
        
        if (selectedVariant.has("lines")) {
            selectedVariant.get("lines").forEach(line -> 
                lines.add(line.asText())
            );
        }
        
        return lines;
    }
    
    /**
     * 獲取結局文本
     */
    public EndingText getEndingNarrative(String endingType) {
        JsonNode endingNode = endings.get(endingType);
        
        List<String> narrative = new ArrayList<>();
        endingNode.get("narrative").forEach(line -> 
            narrative.add(line.asText())
        );
        
        return new EndingText(
            endingNode.get("title").asText(),
            narrative,
            endingNode.get("epilogue").asText()
        );
    }
    
    private JsonNode selectVariant(JsonNode eventNode, WorldState state) {
        // 實現條件邏輯來選擇正確的變體
        // 例如：first_time vs repeated, panic vs normal 等
        return eventNode.has("default") ? eventNode.get("default") : eventNode;
    }
    
    public record EndingText(String title, List<String> narrative, String epilogue) {}
}
```

### Step 3: 修改 SceneManager 使用 NarrativeService

```java
@Service
public class SceneManager {
    
    private final RuleEvaluator ruleEvaluator;
    private final NarrativeService narrativeService; // 新增
    
    public SceneManager(RuleEvaluator ruleEvaluator, NarrativeService narrativeService) {
        this.ruleEvaluator = ruleEvaluator;
        this.narrativeService = narrativeService;
    }
    
    private String getNarrative(Location location, WorldState state) {
        // 使用 NarrativeService 而不是硬編碼
        return narrativeService.getLocationNarrative(location.name(), state);
    }
    
    private String getEndingNarrative(EndingStatus ending) {
        var endingText = narrativeService.getEndingNarrative(ending.name());
        return String.join("\n", endingText.narrative());
    }
}
```

---

## 🎮 文本顯示時機控制

### 時機類型

| 時機 | 觸發點 | 對應代碼位置 |
|------|--------|------------|
| **地點進入** | 玩家移動到新地點 | `SceneManager.getLocationScene()` |
| **事件觸發** | 玩家執行動作 | `GameEngine.processAction()` → `SceneManager` |
| **規則顯示** | 特定條件滿足 | `RuleEvaluator.shouldShowRule()` |
| **結局觸發** | 滿足結局條件 | `StateEvaluator.resolveEnding()` |
| **狀態變化** | SAN值改變等 | `WebSocketService.sendStateUpdate()` |

### 控制邏輯範例

```java
// 在 GameEngine.processAction() 中
public void processAction(PlayerAction action) {
    // 1. 應用事件效果
    stateEvaluator.applyEvent(session, action.getEventType());
    
    // 2. 獲取事件敘事
    List<String> eventNarrative = narrativeService.getEventNarrative(
        action.getEventType().name(), 
        session.getWorldState()
    );
    
    // 3. 發送敘事到前端
    if (!eventNarrative.isEmpty()) {
        webSocketService.sendSceneUpdate(
            session.getSessionId(),
            "event_" + action.getEventType(),
            eventNarrative
        );
    }
    
    // 4. 檢查規則顯示
    // 5. 檢查結局
    // ...
}
```

---

## 📝 最佳實踐

### 1. 文本編寫建議

- ✅ 使用簡短的行（每行 20-40 字）
- ✅ 重要信息用【】標記
- ✅ 恐怖元素用「...」製造懸疑
- ✅ 保持一致的語氣和視角（第一人稱）

### 2. 條件分支設計

```json
{
  "事件名稱": {
    "條件A": { "lines": [...], "sanity_loss": 10 },
    "條件B": { "lines": [...], "sanity_gain": 15 },
    "default": { "lines": [...] }
  }
}
```

### 3. 多語言支援準備

目錄結構：
```
narratives/
├── zh-TW/
│   ├── locations.json
│   ├── events.json
│   └── endings.json
└── en-US/
    ├── locations.json
    ├── events.json
    └── endings.json
```

---

## 🚀 快速開始

### 現在就可以做的事：

1. **創建 narratives 目錄**
```bash
mkdir -p onsen-backend/src/main/resources/narratives
```

2. **創建第一個 JSON 文件**
```bash
touch onsen-backend/src/main/resources/narratives/locations.json
```

3. **填入內容**（使用上面的範例）

4. **創建 NarrativeService**（參考上面的代碼）

5. **修改 SceneManager**（整合 NarrativeService）

6. **測試**
```bash
docker-compose down
docker-compose up --build -d
```

---

## 📌 總結

**推薦使用 JSON 配置方案**因為：
- 🎨 易於編寫和修改遊戲文本
- 🌍 支援未來的多語言需求
- 🔄 可以熱更新（透過 reload 機制）
- 📊 結構清晰，便於團隊協作
- ✨ 分離關注點：程式邏輯 vs 內容創作

開始寫你的恐怖故事吧！ 🦈👻
