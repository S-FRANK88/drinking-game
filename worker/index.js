// ============================================================
// 酒桌模拟器 - Cloudflare Worker API 代理
// 保护 Gemini API Key 不暴露给前端
// ============================================================

const GEMINI_API = 'https://generativelanguage.googleapis.com/v1beta/models';

export default {
  async fetch(request, env) {
    // CORS 预检
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(env, request) });
    }

    // 只允许 POST
    if (request.method !== 'POST') {
      return jsonResponse({ error: '只支持 POST 请求' }, 405, env, request);
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      if (path === '/api/dialogue') {
        return await handleDialogue(request, env);
      } else if (path === '/api/toast-score') {
        return await handleToastScore(request, env);
      } else if (path === '/api/reaction') {
        return await handleReaction(request, env);
      } else if (path === '/api/slogan') {
        return await handleSlogan(request, env);
      } else {
        return jsonResponse({ error: '未知接口' }, 404, env, request);
      }
    } catch (err) {
      return jsonResponse({ error: '服务器错误', detail: err.message }, 500, env, request);
    }
  }
};

// ── 生成对话 ──
async function handleDialogue(request, env) {
  const { relative, player } = await request.json();

  const prompt = `你是一个春节酒桌模拟器游戏的对话生成器。

当前场景：春节家庭聚餐酒桌上。

亲戚信息：
- 姓名：${relative.name}
- 称呼：${relative.title}
- 关系：${relative.relation}
- 性格特征：${relative.traits.join('、')}

玩家信息：
- 姓名：${player.name}
- 年龄：${player.age}岁
- 职业：${player.job}
- 收入：${player.incomeRange}
- 学历：${player.education}
- 感情状态：${player.relationshipStatus}
- 老家：${player.hometown}
- 工作城市：${player.city}

请用这个亲戚的口吻和性格，生成一个春节酒桌上的问题。

问题类型要多样化，包括：
1. 关心类（30%）：真诚关心玩家的生活、健康、工作压力，表达温暖
2. 刁难类（30%）：带有挑战性的问题，可能涉及攀比、催婚、质疑
3. 好奇类（20%）：对玩家生活、工作、兴趣的好奇询问
4. 怀旧类（20%）：回忆过去，聊童年趣事，拉近关系

问题要贴合亲戚的性格和玩家的身份，口语化，有感情。

严格按以下 JSON 格式返回（不要加任何其他文字）：
{
  "text": "亲戚说的话（一句话，口语化，带感情）",
  "options": [
    {
      "text": "玩家回答选项1（顺从型）",
      "type": "compliant",
      "faceChange": 8,
      "moodChange": -5,
      "reaction": "亲戚对这个回答的反应"
    },
    {
      "text": "玩家回答选项2（中立型）",
      "type": "neutral",
      "faceChange": 3,
      "moodChange": 3,
      "reaction": "亲戚对这个回答的反应"
    },
    {
      "text": "玩家回答选项3（叛逆型）",
      "type": "rebellious",
      "faceChange": -10,
      "moodChange": 10,
      "reaction": "亲戚对这个回答的反应"
    }
  ]
}

规则：
- compliant 选项：面子+5~+15，心态-3~-10
- neutral 选项：面子-3~+5，心态0~+5
- rebellious 选项：面子-5~-15，心态+5~+15
- reaction 要符合亲戚性格，口语化
- 关心类问题的reaction应该更温暖、更支持玩家`;

  const result = await callGemini(env, prompt);
  return jsonResponse(result, 200, env, request);
}

// ── 祝酒辞评分 ──
async function handleToastScore(request, env) {
  const { text, relatives } = await request.json();

  const relativeNames = relatives.map(r => `${r.name}(${r.title}，特征：${r.traits.join('、')})`).join('；');

  const prompt = `你是春节酒桌模拟器的祝酒辞评分系统。

玩家说了这段祝酒辞："${text}"

在场亲戚：${relativeNames}

请评分并严格按以下 JSON 格式返回（不要加任何其他文字）：
{
  "score": 总分(0-100的整数),
  "comment": "一句话点评（幽默风趣）",
  "breakdown": {
    "sincerity": 真诚度分(0-30),
    "humor": 幽默感分(0-20),
    "relevance": 贴合度分(0-30),
    "eloquence": 文采分(0-20)
  }
}

评分标准：
- 提到亲戚名字加分
- 提到亲戚特征加分
- 有祝福词（新年好、恭喜发财等）加分
- 内容越真诚、越有趣越高分
- 太短或敷衍扣分`;

  const result = await callGemini(env, prompt);
  return jsonResponse(result, 200, env, request);
}

// ── 生成反应 ──
async function handleReaction(request, env) {
  const { relative, playerChoice, question } = await request.json();

  const prompt = `你是${relative.name}（${relative.title}），性格：${relative.traits.join('、')}。

你刚问了："${question}"
对方回答了："${playerChoice}"

请用你的性格口吻回应一句话（15-30字，口语化，可以带点情绪）。
只返回回应的文字，不要加引号或其他格式。`;

  const result = await callGemini(env, prompt, true);
  return jsonResponse({ reaction: result }, 200, env, request);
}

// ── 生成亲戚slogan ──
async function handleSlogan(request, env) {
  const { relative } = await request.json();

  const prompt = `你是一个春节酒桌模拟器游戏的文案生成器。

亲戚信息：
- 姓名：${relative.name}
- 称呼：${relative.title}
- 关系：${relative.relation}
- 性格特征：${relative.traits.join('、')}

请为这个亲戚生成一句符合其性格特征的个性化slogan台词。

要求：
- 10-20个字
- 口语化，有个性
- 体现亲戚的性格特征
- 可以幽默、犀利、温暖或霸气
- 像是这个亲戚的口头禅或座右铭

只返回slogan文字，不要加引号或其他格式。

示例：
- 爱管闲事的："你这孩子，我不说谁说？"
- 炫耀型的："我家孩子可争气了！"
- 温和型的："慢慢来，别着急。"
- 强势型的："听我的，准没错！"`;

  const result = await callGemini(env, prompt, true);
  return jsonResponse({ slogan: result }, 200, env, request);
}

// ── 调用 Gemini API ──
async function callGemini(env, prompt, rawText = false) {
  const model = 'gemini-2.0-flash';
  const url = `${GEMINI_API}/${model}:generateContent?key=${env.GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 1024,
      }
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API 错误: ${response.status} - ${err}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  if (rawText) return text.trim();

  // 解析 JSON（去掉可能的 markdown 代码块标记）
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error('AI 返回格式错误: ' + cleaned.substring(0, 200));
  }
}

// ── CORS 头 ──
const ALLOWED_ORIGINS = [
  'https://guonian.banzhang.icu',
  'https://s-frank88.github.io',
  'https://drinking-game-cu9.pages.dev'
];

function corsHeaders(env, request) {
  const origin = request?.headers?.get('Origin') || '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

// ── JSON 响应 ──
function jsonResponse(data, status, env, request) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(env, request),
    }
  });
}
