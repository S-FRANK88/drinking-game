# 需求文档

## 简介

在酒桌模拟器春节版的开局封面界面（Cover Screen）上，新增困难模式和超级困难模式的选择按钮，让玩家可以直接在封面界面选择不同难度开始游戏。两个高难度模式使用符合春节特色的名字，与游戏的春节主题保持一致。

## 术语表

- **Cover_Screen**：游戏封面界面，即玩家进入游戏后看到的第一个界面，包含游戏标题和开始按钮
- **GameEngine**：游戏引擎，负责管理游戏状态和流程，包含 `startGame(difficulty)` 方法
- **Difficulty_Parameter**：难度参数，传递给 `GameEngine.startGame()` 的字符串值，可选值为 `'normal'`、`'hard'`、`'hell'`
- **Normal_Mode**：普通模式，5位亲戚，对应 difficulty='normal'
- **Hard_Mode**：困难模式，10位亲戚，对应 difficulty='hard'
- **Hell_Mode**：地狱模式，50位亲戚，对应 difficulty='hell'
- **renderCover**：`app.js` 中负责渲染封面界面的函数

## 需求

### 需求 1：在封面界面显示难度选择按钮

**用户故事：** 作为玩家，我希望在封面界面看到不同难度的选择按钮，以便我可以直接选择想要的难度开始游戏。

#### 验收标准

1. THE Cover_Screen SHALL 在现有"入座"按钮下方显示两个额外的难度选择按钮
2. THE Cover_Screen SHALL 将"入座"按钮保留为普通模式（Normal_Mode）的入口，功能不变
3. WHEN 封面界面渲染完成时，THE Cover_Screen SHALL 同时显示三个难度入口按钮（普通、困难、地狱）

### 需求 2：为高难度模式使用春节特色名称

**用户故事：** 作为玩家，我希望高难度模式有符合春节氛围的名字，以便增强游戏的节日沉浸感。

#### 验收标准

1. THE Cover_Screen SHALL 为 Hard_Mode 按钮显示春节特色名称"满汉全席"及对应的难度说明（如亲戚数量）
2. THE Cover_Screen SHALL 为 Hell_Mode 按钮显示春节特色名称"八仙过海"及对应的难度说明（如亲戚数量）
3. THE Cover_Screen SHALL 为每个难度按钮显示一个表意图标（emoji），帮助玩家快速区分难度

### 需求 3：点击难度按钮启动对应难度的游戏

**用户故事：** 作为玩家，我希望点击不同难度按钮后能以对应难度开始游戏，以便体验不同挑战。

#### 验收标准

1. WHEN 玩家点击"入座"按钮时，THE GameEngine SHALL 以 Difficulty_Parameter 值 'normal' 启动游戏
2. WHEN 玩家点击"满汉全席"按钮时，THE GameEngine SHALL 以 Difficulty_Parameter 值 'hard' 启动游戏
3. WHEN 玩家点击"八仙过海"按钮时，THE GameEngine SHALL 以 Difficulty_Parameter 值 'hell' 启动游戏
4. WHEN 任意难度按钮被点击后，THE Cover_Screen SHALL 跳转到身份卡界面（Identity Screen）

### 需求 4：难度按钮样式与春节主题一致

**用户故事：** 作为玩家，我希望难度按钮的视觉风格与游戏整体的红金春节主题一致，以便界面美观协调。

#### 验收标准

1. THE Cover_Screen SHALL 使用与现有按钮一致的红金配色方案渲染难度选择按钮
2. THE Cover_Screen SHALL 通过视觉层级区分普通模式按钮（主按钮样式）和高难度模式按钮（次级按钮样式）
3. WHEN 封面界面在不同屏幕宽度下显示时，THE Cover_Screen SHALL 保持难度按钮的可读性和可点击性
