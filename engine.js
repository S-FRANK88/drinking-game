// ============================================================
// 酒桌模拟器 - 春节版 | 游戏引擎
// ============================================================

// ── DataLoader ──
class DataLoader {
  constructor(config) {
    this.config = config;
    this.relatives = [];
    this.questions = [];
    this.achievements = [];
  }

  loadRelatives() {
    const data = this.config.relatives || [];
    this.relatives = data.filter(r => this.validateRelative(r));
    return this.relatives;
  }

  loadQuestions() {
    const data = this.config.questions || [];
    this.questions = data.filter(q => this.validateQuestion(q));
    return this.questions;
  }

  loadAchievements() {
    const data = this.config.achievements || [];
    this.achievements = data.filter(a => this.validateAchievement(a));
    return this.achievements;
  }

  validateRelative(r) {
    return r && r.id && r.name && r.title && r.relation && r.type
      && Array.isArray(r.traits) && r.traits.length > 0
      && Array.isArray(r.questionTags) && r.avatar;
  }

  validateQuestion(q) {
    return q && q.id && q.text && Array.isArray(q.tags)
      && Array.isArray(q.options) && q.options.length >= 2 && q.options.length <= 4
      && q.options.every(o => o.text && o.type && o.reaction !== undefined
        && typeof o.faceChange === 'number' && typeof o.moodChange === 'number');
  }

  validateAchievement(a) {
    return a && a.id && a.name && a.description && a.icon
      && typeof a.condition === 'function';
  }

  loadAll() {
    this.loadRelatives();
    this.loadQuestions();
    this.loadAchievements();
    return { relatives: this.relatives, questions: this.questions, achievements: this.achievements };
  }
}


// ── AIProvider 接口 ──
class AIProvider {
  async generateDialogue(context) { throw new Error('未实现'); }
  async scoreToast(text, relatives) { throw new Error('未实现'); }
  async generateReaction(choice) { throw new Error('未实现'); }
}

// ── StaticAIProvider（前期使用） ──
class StaticAIProvider extends AIProvider {
  constructor(questionDB) {
    super();
    this.questionDB = questionDB;
    this.usedQuestionIds = new Set();
  }

  async generateDialogue(context) {
    const { relative, playerIdentity } = context;
    // 根据亲戚标签和玩家身份筛选问题
    let candidates = this.questionDB.filter(q => {
      if (this.usedQuestionIds.has(q.id)) return false;
      const typeMatch = !q.relativeTypes || q.relativeTypes.length === 0
        || q.relativeTypes.includes(relative.type);
      const tagMatch = !q.tags || q.tags.length === 0
        || q.tags.some(t => relative.questionTags.includes(t));
      let condMatch = true;
      if (q.playerConditions && Object.keys(q.playerConditions).length > 0) {
        for (const [key, val] of Object.entries(q.playerConditions)) {
          if (playerIdentity[key] && playerIdentity[key] !== val) { condMatch = false; break; }
        }
      }
      return typeMatch && tagMatch && condMatch;
    });
    // 如果没有匹配的，放宽条件
    if (candidates.length === 0) {
      candidates = this.questionDB.filter(q => !this.usedQuestionIds.has(q.id));
    }
    // 如果全部用完，重置
    if (candidates.length === 0) {
      this.usedQuestionIds.clear();
      candidates = this.questionDB.slice();
    }
    const question = candidates[Math.floor(Math.random() * candidates.length)];
    this.usedQuestionIds.add(question.id);
    return question;
  }

  async scoreToast(text, relatives) {
    return ToastScorer.score(text, relatives, GAME_DATA.scoringRules, GAME_DATA.festiveWords);
  }

  async generateReaction(choice) {
    return choice.reaction || '嗯...';
  }

  reset() { this.usedQuestionIds.clear(); }
}

// ── 验证与工具函数 ──
function validateQuestionFormat(data) {
  if (!data || typeof data.text !== 'string' || !data.text.trim()) return false;
  if (!Array.isArray(data.options) || data.options.length < 2 || data.options.length > 4) return false;
  const validTypes = ['compliant', 'neutral', 'rebellious'];
  return data.options.every(o =>
    typeof o.text === 'string' && o.text.trim() &&
    validTypes.includes(o.type) &&
    typeof o.faceChange === 'number' &&
    typeof o.moodChange === 'number' &&
    typeof o.reaction === 'string'
  );
}

function validateToastScore(data) {
  return data != null &&
    typeof data.score === 'number' &&
    Number.isInteger(data.score) &&
    data.score >= 0 && data.score <= 100;
}

function cleanMarkdownJSON(str) {
  var cleaned = str.trim();
  cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/i, '');
  cleaned = cleaned.replace(/\s*```\s*$/, '');
  return JSON.parse(cleaned.trim());
}

// ── GeminiAIProvider（通过 Worker 代理调用 Gemini API） ──
class GeminiAIProvider extends AIProvider {
  constructor(workerBaseUrl, fallbackProvider) {
    super();
    this.workerBaseUrl = workerBaseUrl;
    this.fallback = fallbackProvider;
    this.timeout = 10000;
  }

  async _fetchWithFallback(endpoint, body, fallbackFn) {
    try {
      var controller = new AbortController();
      var timeoutId = setTimeout(function() { controller.abort(); }, this.timeout);

      var response = await fetch(this.workerBaseUrl + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error('HTTP ' + response.status);
      return await response.json();
    } catch (error) {
      console.warn('[GeminiAI] ' + endpoint + ' 降级: ' + error.message, new Date().toISOString());
      return fallbackFn();
    }
  }

  async generateDialogue(context) {
    var self = this;
    var body = {
      relative: context.relative,
      player: context.playerIdentity
    };
    var data = await this._fetchWithFallback('/api/dialogue', body, function() {
      return self.fallback.generateDialogue(context);
    });
    if (!validateQuestionFormat(data)) {
      console.warn('[GeminiAI] /api/dialogue 响应格式无效，降级', new Date().toISOString());
      return this.fallback.generateDialogue(context);
    }
    if (!data.id) {
      data.id = 'ai_' + Date.now();
    }
    return data;
  }

  async scoreToast(text, relatives) {
    var self = this;
    var body = {
      text: text,
      relatives: relatives
    };
    var data = await this._fetchWithFallback('/api/toast-score', body, function() {
      return ToastScorer.score(text, relatives, GAME_DATA.scoringRules, GAME_DATA.festiveWords);
    });
    if (!validateToastScore(data)) {
      console.warn('[GeminiAI] /api/toast-score 响应格式无效，降级', new Date().toISOString());
      return ToastScorer.score(text, relatives, GAME_DATA.scoringRules, GAME_DATA.festiveWords);
    }
    return data;
  }

  async generateReaction(choice) {
    var body = {
      relative: choice.relative,
      playerChoice: choice.playerChoice,
      question: choice.question
    };
    var data = await this._fetchWithFallback('/api/reaction', body, function() {
      return choice.reaction || '嗯...';
    });
    return data;
  }
}


// ── ToastScorer（静态评分） ──
class ToastScorer {
  static score(text, relatives, rules, festiveWords) {
    if (!text || text.trim().length === 0) return { score: 0, breakdown: {} };
    const t = text.trim();

    // 基础祝福词
    let basicScore = 0;
    festiveWords.forEach(w => { if (t.includes(w)) basicScore += rules.toastBasicWordScore; });
    basicScore = Math.min(basicScore, rules.toastBasicWordMax);

    // 姓名匹配
    let nameScore = 0;
    relatives.forEach(r => { if (t.includes(r.name)) nameScore += rules.toastNameScore; });
    nameScore = Math.min(nameScore, rules.toastNameMax);

    // 特征匹配
    let traitScore = 0;
    relatives.forEach(r => {
      (r.traitKeywords || []).forEach(kw => { if (t.includes(kw)) traitScore += rules.toastTraitScore; });
    });
    traitScore = Math.min(traitScore, rules.toastTraitMax);

    // 长度奖励
    let lengthScore = Math.floor(t.length / rules.toastLengthPer) * rules.toastLengthScore;
    lengthScore = Math.min(lengthScore, rules.toastLengthMax);

    const total = Math.min(basicScore + nameScore + traitScore + lengthScore, rules.toastTotalMax);
    return { score: total, breakdown: { basicScore, nameScore, traitScore, lengthScore } };
  }
}

// ── IdentityGenerator ──
class IdentityGenerator {
  constructor(relativeDB, playerPool) {
    this.relativeDB = relativeDB;
    this.playerPool = playerPool;
  }

  generatePlayer() {
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const p = this.playerPool;
    return {
      name: pick(p.names),
      age: 22 + Math.floor(Math.random() * 9),
      job: pick(p.jobs),
      hometown: pick(p.hometowns),
      city: pick(p.cities),
      incomeRange: pick(p.incomeRanges),
      relationshipStatus: pick(p.relationshipStatuses),
      education: pick(p.educations)
    };
  }

  generateRelatives(count = 5) {
    // 尽量选不同类型
    const types = ['长辈_男', '长辈_女', '同辈_男', '同辈_女'];
    const pool = [...this.relativeDB];
    const selected = [];
    const usedTypes = new Set();

    // 先每种类型选一个
    for (const type of types) {
      if (selected.length >= count) break;
      const ofType = pool.filter(r => r.type === type && !selected.includes(r));
      if (ofType.length > 0) {
        const r = ofType[Math.floor(Math.random() * ofType.length)];
        selected.push(r);
        usedTypes.add(type);
      }
    }
    // 补齐剩余
    while (selected.length < count) {
      const remaining = pool.filter(r => !selected.includes(r));
      if (remaining.length === 0) break;
      selected.push(remaining[Math.floor(Math.random() * remaining.length)]);
    }
    return selected;
  }
}


// ── SeatingMatcher ──
class SeatingMatcher {
  constructor() {
    this.assignments = new Map(); // seatIndex -> relative
    this.matches = new Map();     // seatIndex -> selectedTitle
    this.relatives = [];
  }

  assignSeats(relatives) {
    this.relatives = relatives;
    const indices = [0, 1, 2, 3, 4];
    // Fisher-Yates shuffle
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    indices.forEach((ri, si) => this.assignments.set(si, relatives[ri]));
    return this.assignments;
  }

  submitMatch(seatIndex, title) {
    this.matches.set(seatIndex, title);
  }

  evaluateAll() {
    let correct = 0, wrong = 0;
    const results = new Map();
    for (let i = 0; i < 5; i++) {
      const rel = this.assignments.get(i);
      const selected = this.matches.get(i);
      const isCorrect = rel && selected === rel.title;
      results.set(i, isCorrect);
      if (isCorrect) correct++; else wrong++;
    }
    return { correct, wrong, results, correctCount: correct };
  }
}

// ── DialogueSystem ──
class DialogueSystem {
  constructor(relatives, aiProvider, playerIdentity) {
    this.relatives = relatives;
    this.aiProvider = aiProvider;
    this.playerIdentity = playerIdentity;
    this.currentRound = 0;
    this.totalRounds = 5;
    this.history = [];
    this.choicePattern = [];
    this.autoTimer = null;
  }

  startDialoguePhase() {
    this.currentRound = 0;
    this.history = [];
    this.choicePattern = [];
  }

  async triggerDialogue(relativeIndex) {
    this.clearAutoTimer();
    const relative = this.relatives[relativeIndex];
    const question = await this.aiProvider.generateDialogue({
      relative, playerIdentity: this.playerIdentity
    });
    this.currentRound++;
    return { relative, question, round: this.currentRound };
  }

  async autoTriggerDialogue() {
    const idx = Math.floor(Math.random() * this.relatives.length);
    return this.triggerDialogue(idx);
  }

  selectOption(question, optionIndex) {
    const option = question.options[optionIndex];
    this.choicePattern.push(option.type);
    this.history.push({ questionId: question.id, optionIndex, type: option.type });
    return {
      faceChange: option.faceChange,
      moodChange: option.moodChange,
      reaction: option.reaction,
      type: option.type
    };
  }

  getCurrentRound() { return this.currentRound; }
  isPhaseComplete() { return this.currentRound >= this.totalRounds; }

  startAutoTimer(callback, delay = 10000) {
    this.clearAutoTimer();
    this.autoTimer = setTimeout(callback, delay);
  }
  clearAutoTimer() {
    if (this.autoTimer) { clearTimeout(this.autoTimer); this.autoTimer = null; }
  }
}


// ── DrinkingSystem ──
class DrinkingSystem {
  constructor(gameEngine) {
    this.engine = gameEngine;
    this.glassLevel = 100;
    this.toastCount = 0;
    this.emptyTimer = null;
  }

  triggerToast(relativeIndex) {
    this.toastCount++;
    return { relativeIndex, relative: this.engine.state.relatives[relativeIndex] };
  }

  respondToast(choice) {
    const rules = GAME_DATA.scoringRules;
    let alcoholDelta = 0, faceDelta = 0;
    switch (choice) {
      case 'sip': alcoholDelta = rules.drinkSip; faceDelta = rules.sipFaceChange; break;
      case 'gulp': alcoholDelta = rules.drinkGulp; faceDelta = 0; break;
      case 'bottoms_up': alcoholDelta = rules.drinkBottomsUp; faceDelta = rules.bottomsUpFaceChange; break;
    }
    this.engine.adjustAlcohol(alcoholDelta);
    if (faceDelta !== 0) this.engine.adjustFace(faceDelta);
    this.glassLevel = Math.max(0, this.glassLevel - (alcoholDelta * 2));
    return { alcoholDelta, faceDelta, isDrunk: this.engine.checkDrunkStatus() };
  }

  getGlassLevel() { return this.glassLevel; }
  isGlassEmpty() { return this.glassLevel <= 0; }
  refillGlass() { this.glassLevel = 100; }

  startEmptyTimer(callback, delay = 5000) {
    this.cancelEmptyTimer();
    this.emptyTimer = setTimeout(callback, delay);
  }
  cancelEmptyTimer() {
    if (this.emptyTimer) { clearTimeout(this.emptyTimer); this.emptyTimer = null; }
  }
}

// ── ResultGenerator ──
class ResultGenerator {
  constructor(achievementDB) {
    this.achievementDB = achievementDB;
  }

  calculateAchievements(scores, gameState) {
    return this.achievementDB.filter(a => {
      try { return a.condition(scores, gameState); } catch { return false; }
    });
  }

  async generateResultCard(elementId) {
    const el = document.getElementById(elementId);
    if (!el || typeof html2canvas === 'undefined') return null;
    try {
      const canvas = await html2canvas(el, { backgroundColor: '#5C0000', scale: 2 });
      return canvas.toDataURL('image/png');
    } catch { return null; }
  }

  downloadImage(dataUrl, filename = '酒桌模拟器_结算.png') {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    a.click();
  }

  downloadAudio(blob, filename = '祝酒辞录音.webm') {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}


// ── GameEngine（核心状态机） ──
const PHASES = ['COVER', 'IDENTITY_CARD', 'INTRO', 'SEATING', 'DIALOGUE', 'TOAST', 'RESULT', 'DRUNK_END'];
const VALID_TRANSITIONS = {
  'COVER': ['IDENTITY_CARD'],
  'IDENTITY_CARD': ['INTRO'],
  'INTRO': ['SEATING'],
  'SEATING': ['DIALOGUE'],
  'DIALOGUE': ['TOAST', 'DRUNK_END'],
  'TOAST': ['RESULT'],
  'DRUNK_END': ['RESULT'],
  'RESULT': ['COVER']
};

class GameEngine {
  constructor(dataLoader, aiProvider) {
    this.dataLoader = dataLoader;
    this.aiProvider = aiProvider;
    this.identityGen = null;
    this.seatingMatcher = null;
    this.dialogueSystem = null;
    this.drinkingSystem = null;
    this.resultGenerator = null;
    this.state = this.createInitialState();
    this.onStateChange = null; // callback
  }

  createInitialState() {
    return {
      phase: 'COVER',
      player: null,
      relatives: [],
      scores: { face: 50, mood: 50, alcohol: 0 },
      seatingResult: null,
      dialogueState: { currentRound: 0, totalRounds: 5, history: [], choicePattern: [] },
      drinkingState: { glassLevel: 100, toastCount: 0 },
      toastText: '',
      toastAudioBlob: null,
      achievements: []
    };
  }

  getState() { return this.state; }

  transition(newPhase) {
    const allowed = VALID_TRANSITIONS[this.state.phase];
    if (!allowed || !allowed.includes(newPhase)) {
      console.warn(`非法阶段切换: ${this.state.phase} -> ${newPhase}`);
      return false;
    }
    this.state.phase = newPhase;
    if (this.onStateChange) this.onStateChange(this.state);
    return true;
  }

  adjustFace(delta) {
    this.state.scores.face = Math.max(0, Math.min(999, this.state.scores.face + delta));
    this.updateUI();
  }
  adjustMood(delta) {
    this.state.scores.mood = Math.max(0, Math.min(999, this.state.scores.mood + delta));
    this.updateUI();
  }
  adjustAlcohol(delta) {
    this.state.scores.alcohol = Math.max(0, Math.min(100, this.state.scores.alcohol + delta));
    this.updateUI();
  }

  checkDrunkStatus() {
    if (this.state.scores.alcohol >= 100) {
      this.transition('DRUNK_END');
      return true;
    }
    return false;
  }

  updateUI() {
    const fe = document.getElementById('face-score');
    const me = document.getElementById('mood-score');
    const ae = document.getElementById('alcohol-level');
    if (fe) fe.textContent = this.state.scores.face;
    if (me) me.textContent = this.state.scores.mood;
    if (ae) ae.textContent = this.state.scores.alcohol;
  }

  startGame() {
    const data = this.dataLoader.loadAll();
    this.identityGen = new IdentityGenerator(data.relatives, GAME_DATA.playerPool);
    this.resultGenerator = new ResultGenerator(data.achievements);

    this.state.player = this.identityGen.generatePlayer();
    this.state.relatives = this.identityGen.generateRelatives(5);
    this.state.scores = { face: 50, mood: 50, alcohol: 0 };

    if (this.aiProvider instanceof StaticAIProvider) this.aiProvider.reset();

    this.seatingMatcher = new SeatingMatcher();
    this.dialogueSystem = new DialogueSystem(this.state.relatives, this.aiProvider, this.state.player);
    this.drinkingSystem = new DrinkingSystem(this);

    this.updateUI();
    this.transition('IDENTITY_CARD');
  }

  endGame(reason = 'normal') {
    if (this.dialogueSystem) this.dialogueSystem.clearAutoTimer();
    if (this.drinkingSystem) this.drinkingSystem.cancelEmptyTimer();

    this.state.dialogueState.choicePattern = this.dialogueSystem ? this.dialogueSystem.choicePattern : [];
    this.state.achievements = this.resultGenerator.calculateAchievements(this.state.scores, this.state);

    if (reason === 'drunk') {
      this.transition('RESULT');
    } else {
      this.transition('RESULT');
    }
  }

  resetGame() {
    if (this.dialogueSystem) this.dialogueSystem.clearAutoTimer();
    if (this.drinkingSystem) this.drinkingSystem.cancelEmptyTimer();
    this.state = this.createInitialState();
    this.updateUI();
    if (this.onStateChange) this.onStateChange(this.state);
  }
}
