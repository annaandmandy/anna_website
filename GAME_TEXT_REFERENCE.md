# 遊戲文本快速參考

## 📂 文件位置

```
onsen-backend/src/main/resources/narratives/
├── locations.json  ✅ 已創建 - 地點相關文本
├── events.json     ✅ 已創建 - 事件觸發文本  
└── endings.json    ✅ 已創建 - 結局文本
```

## 🎯 何時顯示什麼文本？

### 1️⃣ 地點文本 (locations.json)

**觸發時機:** 玩家進入新地點時
**控制位置:** `SceneManager.getLocationScene()`

| 地點 | 預設文本 | 條件變體 |
|------|---------|---------|
| HOME | 家中醒來 | loop_1, loop_2 |
| ENTRANCE | 抵達入口 | first_visit, return_visit |
| HOT_SPRING | 進入熱水 | noticedFin, exposure_high, sanity_low |
| COLD_SPRING | 冷泉效果 | panic_recovery, strategic_use |
| SHARK_POOL | 特別池 | low_sanity, bleeding |

### 2️⃣ 事件文本 (events.json)

**觸發時機:** 玩家執行動作時
**控制位置:** `GameEngine.processAction()` → 發送到 WebSocket

| 事件 | 說明 | 效果 |
|------|------|------|
| GAME_START | 遊戲開始 | 歡迎訊息 |
| ENTER_HOT_SPRING | 進入溫泉 | first_time / repeated |
| LOOK_AROUND | 環顧四周 | 可能發現魚鰭 (SAN -15) |
| STAY_TOO_LONG | 停留過久 | warning (SAN -10) / danger (SAN -20) |
| ENTER_COLD_SPRING | 使用冷泉 | SAN +15 或 +25 |
| LEAVE_FACILITY | 離開設施 | normal / panic |
| NOTICE_FIN | 注意到魚鰭 | SAN -15 |
| INJURED | 受傷流血 | 觸發處置流程 |
| ATTACKED_VISITOR | 攻擊訪客 | 觸發處置流程 |
| STAFF_GUIDANCE | 工作人員引導 | 前往特別池 |

### 3️⃣ 結局文本 (endings.json)

**觸發時機:** 滿足結局條件時
**控制位置:** `StateEvaluator.resolveEnding()`

| 結局代碼 | 中文名稱 | 觸發條件 |
|---------|---------|---------|
| SURVIVE_LOOP_A | 驚恐逃離 | 發現異常 + SAN < 50 |
| SURVIVE_LOOP_B | 冷靜應對 | 使用冷泉 + SAN >= 70 |
| SURVIVE_LOOP_C | 完美通關 | 未發現異常 + SAN >= 80 |
| END_DISPOSAL | 規則違反者 | 流血或攻擊 + 進入鯊魚池 |
| END_ASSIMILATION | 與深淵同化 | SAN < 10 + 進入鯊魚池 |

## ✏️ 如何編輯文本？

### 修改地點描述
打開 `locations.json`，找到對應地點：
```json
"HOT_SPRING": {
  "default": "在這裡修改預設文本",
  "conditions": {
    "noticedFin": "添加新的條件文本"
  }
}
```

### 添加新事件文本
打開 `events.json`，添加新事件：
```json
"YOUR_NEW_EVENT": {
  "default": {
    "lines": [
      "第一行文本",
      "第二行文本",
      "第三行文本"
    ],
    "sanity_loss": 5  // 可選：SAN值變化
  }
}
```

### 修改結局文本
打開 `endings.json`，編輯對應結局：
```json
"SURVIVE_LOOP_A": {
  "title": "結局標題",
  "narrative": [
    "結局故事第一行",
    "第二行",
    "空行用空字串 \"\"",
    "繼續故事..."
  ],
  "epilogue": "結局總結文字"
}
```

## 🔧 下一步：實作 NarrativeService

目前 JSON 文件已創建，但還需要：

1. ✅ 創建 JSON 配置文件
2. ⬜ 創建 `NarrativeService.java` 來讀取這些文件
3. ⬜ 修改 `SceneManager.java` 使用 NarrativeService
4. ⬜ 測試文本顯示

詳細實作步驟請參考 `GAME_TEXT_GUIDE.md`

## 💡 寫作提示

### 恐怖氛圍營造
- ✅ 使用「...」製造懸疑感
- ✅ 短句增加緊張感
- ✅ 用【】標記重要訊息
- ✅ 善用空行控制節奏

### 範例對比

❌ 普通寫法：
```
我看到水裡有東西在動，好像是魚鰭，感到很害怕
```

✅ 恐怖寫法：
```
等等...那是什麼？
水面下...有東西在移動
那看起來像是...魚鰭？
不，不可能。一定是錯覺。
```

## 📊 文本統計

- **地點數量:** 5 個
- **事件類型:** 10+ 個
- **結局數量:** 5 個
- **總文本行數:** 100+ 行

隨時可以擴充更多內容！ 🎮
