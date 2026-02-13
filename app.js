// ============================================================
// 酒桌模拟器 - 春节版 | 应用主入口 (v3 - 红底白卡风格)
// ============================================================

(function() {
  'use strict';

  // ── AI 配置 ──
  // 部署时替换为你的 Cloudflare Worker URL，例如：https://drinking-game-api.你的子域名.workers.dev
  // Worker 部署命令：cd worker && npx wrangler deploy
  // API Key 设置：npx wrangler secret put GEMINI_API_KEY
  const WORKER_URL = 'https://api.banzhang.icu';
  const USE_AI = true; // Gemini AI 已启用

  const dataLoader = new DataLoader(GAME_DATA);
  const allData = dataLoader.loadAll();
  const staticProvider = new StaticAIProvider(allData.questions);
  const aiProvider = USE_AI
    ? new GeminiAIProvider(WORKER_URL, staticProvider)
    : staticProvider;
  const engine = new GameEngine(dataLoader, aiProvider);

  const screens = {
    cover: document.getElementById('screen-cover'),
    identity: document.getElementById('screen-identity'),
    intro: document.getElementById('screen-intro'),
    seating: document.getElementById('screen-seating'),
    dialogue: document.getElementById('screen-dialogue'),
    toast: document.getElementById('screen-toast'),
    result: document.getElementById('screen-result')
  };
  const statusBar = document.getElementById('status-bar');
  const bgmToggle = document.getElementById('bgm-toggle');

  // ── 红包雨特效 ──
  function createRedPacketRain() {
    const redPacketEmojis = ['🧧', '💰', '💴', '💵', '💸', '🎁'];
    const count = 15 + Math.floor(Math.random() * 10); // 15-25个红包
    
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const packet = document.createElement('div');
        packet.className = 'red-packet' + (Math.random() > 0.5 ? ' swing' : '');
        packet.textContent = redPacketEmojis[Math.floor(Math.random() * redPacketEmojis.length)];
        
        // 随机水平位置
        const leftPos = Math.random() * 90 + 5; // 5% - 95%
        packet.style.left = leftPos + '%';
        
        // 随机动画时长
        const duration = 2.5 + Math.random() * 1.5; // 2.5-4秒
        packet.style.animationDuration = duration + 's';
        
        document.body.appendChild(packet);
        
        // 动画结束后移除元素
        setTimeout(() => {
          packet.remove();
        }, duration * 1000);
      }, i * 80); // 每个红包间隔80ms
    }
  }

  // ── 福字提示 ──
  function showFuToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(197, 48, 48, 0.95);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      z-index: 9999;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      animation: fadeIn 0.3s ease;
      pointer-events: none;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  function avatarHTML(r, sizeClass = '', clickable = false) {
    const bg = r.avatarBg || 'linear-gradient(135deg, #F5E6D3, #E8D5C0)';
    const cls = `avatar-frame ${sizeClass} ${clickable ? 'clickable' : ''}`;
    return `<div class="${cls}"><div class="avatar-bg" style="background:${bg};opacity:0.3;"></div><span class="avatar-emoji">${r.avatar}</span></div>`;
  }

  function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    if (screens[name]) screens[name].classList.add('active');
    statusBar.classList.toggle('visible', name !== 'cover');
  }

  // ── 成就弹窗 ──
  function showAchievementPopup(icon, name, description) {
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.innerHTML = `
      <div class="popup-card" style="max-width:360px;animation:slideIn 0.5s ease;">
        <div style="font-size:60px;margin-bottom:12px;">${icon}</div>
        <p style="font-family:var(--font-title);font-size:24px;color:var(--gold);margin-bottom:8px;">🎉 成就解锁</p>
        <p style="font-family:var(--font-title);font-size:20px;color:var(--text-red);margin-bottom:8px;">${name}</p>
        <p style="color:var(--text-muted);font-size:14px;margin-bottom:20px;">${description}</p>
        <button class="btn-gold" id="btn-close-achievement" style="width:100%;padding:12px;">继续</button>
      </div>
    `;
    document.body.appendChild(overlay);
    document.getElementById('btn-close-achievement').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  }

  // ── 财神结局 ──
  function showMoneyGodEnding() {
    const p = engine.state.player;
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.innerHTML = `
      <div class="popup-card" style="max-width:420px;">
        <div style="font-size:80px;margin-bottom:12px;animation:pulse 1s infinite;">💸</div>
        <p style="font-family:var(--font-title);font-size:28px;color:var(--gold);margin-bottom:8px;">财神来敲你家门！</p>
        <p style="color:var(--text-body);font-size:15px;line-height:1.8;margin-bottom:16px;">
          ${p.name}，你已经涨工资50次了！<br>
          你的月薪已经达到了 <span style="color:var(--gold);font-weight:700;font-size:18px;">${p.incomeRange}</span><br>
          <br>
          恭喜你，财富自由了！<br>
          不用再参加酒桌了，直接躺平享受人生吧！
        </p>
        <div style="padding:16px;background:var(--card-bg-alt);border-radius:var(--r-sm);margin-bottom:16px;">
          <div style="font-size:40px;margin-bottom:8px;">🎊</div>
          <p style="font-family:var(--font-title);font-size:18px;color:var(--text-red);margin-bottom:4px;">特殊成就解锁</p>
          <p style="font-size:14px;color:var(--text-muted);">财神来敲你家门</p>
        </div>
        <button class="btn-gold" id="btn-money-god-result" style="width:100%;padding:14px;font-size:16px;">查看战报</button>
        <button class="btn-secondary" id="btn-money-god-restart" style="width:100%;margin-top:10px;padding:12px;">重新开始</button>
      </div>
    `;
    document.body.appendChild(overlay);
    
    // 添加财神成就到成就列表
    const moneyGodAch = GAME_DATA.achievements.find(a => a.id === 'ach_money_god');
    if (moneyGodAch && !engine.state.achievements.find(a => a.id === 'ach_money_god')) {
      engine.state.achievements.push(moneyGodAch);
    }
    
    document.getElementById('btn-money-god-result').addEventListener('click', () => {
      overlay.remove();
      engine.endGame('money_god');
      renderResult(false, null);
      showScreen('result');
    });
    
    document.getElementById('btn-money-god-restart').addEventListener('click', () => {
      overlay.remove();
      engine.resetGame();
      renderCover();
      showScreen('cover');
    });
  }

  // ── 封面 ──
  function renderCover() {
    const c = GAME_DATA.coverText;
    screens.cover.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:92vh;padding:20px;">
        <div class="card-main" style="text-align:center;width:100%;max-width:380px;padding:40px 28px;">
          <div style="font-size:36px;margin-bottom:4px;">✦</div>
          <h1 style="font-family:var(--font-title);font-size:48px;color:var(--text-red);letter-spacing:10px;margin:8px 0;">${c.title}</h1>
          <div class="divider-gold divider"><span style="font-size:13px;letter-spacing:4px;color:var(--gold-dark);">${c.subtitle}</span></div>
          <p style="color:var(--text-muted);font-size:14px;line-height:1.9;margin:16px 0 28px;">${c.description}</p>
          <button class="btn-red" id="btn-start" style="width:100%;padding:16px;font-size:20px;">${c.startButton}</button>
          <button class="btn-gold" id="btn-share" style="width:100%;margin-top:10px;padding:12px;">📤 喊别人回家</button>
          <div style="margin-top:24px;font-size:11px;color:var(--text-muted);letter-spacing:2px;">© 东亚家庭压力研究中心</div>
        </div>
      </div>
    `;
    document.getElementById('btn-start').addEventListener('click', () => {
      engine.startGame();
      renderIdentityCard();
      showScreen('identity');
    });
    document.getElementById('btn-share').addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({ title: '酒桌模拟器 - 春节版', text: '快回家过年！春节酒桌等你入座！', url: location.href }).catch(() => {});
      } else {
        alert('复制链接分享给好友吧！');
      }
    });
  }

  // ── 身份卡 ──
  const EDU_RANKS = [
    '跟AI自学',
    '家里蹲', 
    '小学',
    '初中',
    '高中',
    '大专',
    '本科',
    '985本科',
    '硕士',
    '985硕士',
    '海归硕士',
    '博士',
    '博士后',
    '青年教师',
    '副教授',
    '教授',
    '诺贝尔奖得主'
  ];
  const RELATIONSHIP_POOL = ['单身', '恋爱中', '已婚'];
  const CHINA_PROVINCES = [
    '北京', '上海', '天津', '重庆', '河北', '山西', '辽宁', '吉林', '黑龙江',
    '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南',
    '广东', '海南', '四川', '贵州', '云南', '陕西', '甘肃', '青海', '台湾',
    '内蒙古', '广西', '西藏', '宁夏', '新疆', '香港', '澳门'
  ];
  const PROVINCE_CITIES = {
    '河南': ['郑州', '洛阳', '开封', '信阳', '南阳', '商丘', '新乡', '许昌', '平顶山', '周口'],
    '湖南': ['长沙', '株洲', '湘潭', '衡阳', '岳阳', '常德', '张家界', '益阳', '郴州', '永州'],
    '四川': ['成都', '绵阳', '德阳', '南充', '宜宾', '自贡', '乐山', '泸州', '达州', '内江'],
    '山东': ['济南', '青岛', '烟台', '潍坊', '临沂', '淄博', '济宁', '泰安', '威海', '日照'],
    '安徽': ['合肥', '芜湖', '蚌埠', '阜阳', '淮南', '安庆', '宿州', '六安', '马鞍山', '滁州'],
    '江西': ['南昌', '赣州', '九江', '宜春', '吉安', '上饶', '萍乡', '抚州', '景德镇', '新余'],
    '湖北': ['武汉', '宜昌', '襄阳', '荆州', '十堰', '黄石', '孝感', '黄冈', '咸宁', '随州'],
    '广东': ['广州', '深圳', '东莞', '佛山', '中山', '珠海', '惠州', '江门', '湛江', '汕头'],
    '福建': ['福州', '厦门', '泉州', '漳州', '莆田', '三明', '南平', '龙岩', '宁德'],
    '黑龙江': ['哈尔滨', '齐齐哈尔', '牡丹江', '大庆', '佳木斯', '鸡西', '双鸭山', '伊春', '七台河', '鹤岗']
  };

  function renderIdentityCard() {
    const p = engine.state.player;
    const initialFace = p.age >= 60 ? 50 + Math.floor((p.age - 60) / 5) * 100 : 50;
    
    // 初始化涨工资计数器
    if (!engine.state.raiseCount) {
      engine.state.raiseCount = 0;
    }
    
    screens.identity.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:82vh;">
        <div class="card-main id-card-bg" style="width:100%;max-width:380px;">
          <div class="id-card-seal">福</div>
          <div class="id-card-header">
            <h2 class="id-card-title" style="font-size:28px;">年夜饭入场券</h2>
            <div class="id-card-subtitle">NEW YEAR'S EVE DINNER TICKET</div>
          </div>

          <div style="margin-bottom:20px;">
            <div class="info-label">姓名 / NAME</div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
              <input type="text" id="name-input" value="${p.name}" style="font-size:28px;font-weight:700;color:var(--text-dark);border:none;background:transparent;outline:none;width:auto;min-width:80px;max-width:200px;font-family:var(--font-body);" maxlength="10">
              <button class="btn-secondary" id="btn-random-name" style="padding:4px 10px;font-size:12px;border-radius:4px;">🎲 换个名</button>
            </div>
            <div class="info-label">职业 / OCCUPATION</div>
            <div style="display:flex;align-items:center;gap:8px;">
              <div style="font-size:20px;font-weight:700;color:var(--text-red);">${p.job}</div>
            </div>
            <div style="display:flex;align-items:center;gap:6px;margin-top:4px;">
              <span id="income-display" style="font-size:13px;color:var(--text-muted);">"${p.incomeRange}，在${p.city}打拼"</span>
              <button class="btn-secondary" id="btn-raise" style="padding:2px 8px;font-size:11px;border-radius:4px;white-space:nowrap;">💰 涨工资</button>
            </div>
          </div>

          <div class="divider"><span>PROFILE / 个人档案</span></div>

          <div style="display:flex;flex-direction:column;gap:0;margin-bottom:20px;">
            <div class="info-row">
              <div class="info-icon">🎂</div>
              <div style="flex:1;display:flex;align-items:center;justify-content:space-between;">
                <div><div class="info-value" id="age-display">${p.age}岁</div><div class="info-label">年龄 / AGE</div></div>
                <div style="display:flex;gap:4px;">
                  <button class="btn-secondary" id="btn-age-minus" style="padding:2px 8px;font-size:11px;border-radius:4px;">➖</button>
                  <button class="btn-secondary" id="btn-age-plus" style="padding:2px 8px;font-size:11px;border-radius:4px;">➕</button>
                </div>
              </div>
            </div>
            <div class="info-row">
              <div class="info-icon">🎓</div>
              <div style="flex:1;display:flex;align-items:center;justify-content:space-between;">
                <div><div class="info-value" id="edu-display">${p.education}</div><div class="info-label">学历 / EDUCATION</div></div>
                <div style="display:flex;gap:4px;">
                  <button class="btn-secondary" id="btn-dropout" style="padding:2px 8px;font-size:11px;border-radius:4px;">📉 退学</button>
                  <button class="btn-secondary" id="btn-upgrade" style="padding:2px 8px;font-size:11px;border-radius:4px;">📈 升学</button>
                </div>
              </div>
            </div>
            <div class="info-row">
              <div class="info-icon">💕</div>
              <div style="flex:1;display:flex;align-items:center;justify-content:space-between;">
                <div><div class="info-value" id="rel-display">${p.relationshipStatus}</div><div class="info-label">感情 / STATUS</div></div>
                <button class="btn-secondary" id="btn-rel-random" style="padding:2px 8px;font-size:11px;border-radius:4px;">🎲 随机</button>
              </div>
            </div>
            <div class="info-row">
              <div class="info-icon">🏠</div>
              <div style="flex:1;display:flex;align-items:center;justify-content:space-between;">
                <div><div class="info-value" id="hometown-display">${p.hometown}</div><div class="info-label">老家 / HOMETOWN</div></div>
                <button class="btn-secondary" id="btn-change-hometown" style="padding:2px 8px;font-size:11px;border-radius:4px;">➕ 改地址</button>
              </div>
            </div>
          </div>

          <div class="divider"><span>STATS / 初始属性</span></div>

          <div class="stats-row" style="margin-bottom:20px;">
            <div class="stat-col"><div class="stat-lbl">😎 面子</div><div class="stat-num" id="initial-face">${initialFace}</div></div>
            <div class="stat-col"><div class="stat-lbl">🧠 心态</div><div class="stat-num">50</div></div>
            <div class="stat-col"><div class="stat-lbl">🍺 酒精</div><div class="stat-num">0</div></div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <button class="btn-gold" id="btn-reroll" style="padding:12px;font-size:15px;">🔄 换身份</button>
            <button class="btn-red" id="btn-confirm-identity" style="padding:12px;font-size:15px;">✅ 确认入座</button>
          </div>
        </div>
      </div>
    `;

    // 涨工资：每按一次 +1k
    document.getElementById('btn-raise').addEventListener('click', () => {
      // 增加计数器
      engine.state.raiseCount = (engine.state.raiseCount || 0) + 1;
      const count = engine.state.raiseCount;
      
      // 更新工资
      const cur = p.incomeRange;
      const m = cur.match(/(\d+)/);
      if (m) {
        const base = parseInt(m[1]);
        const newBase = base + 1;
        if (cur.includes('-')) {
          const parts = cur.match(/月薪(\d+)k-(\d+)k/);
          if (parts) p.incomeRange = '月薪' + (parseInt(parts[1]) + 1) + 'k-' + (parseInt(parts[2]) + 1) + 'k';
        } else if (cur.includes('+')) {
          p.incomeRange = '月薪' + (newBase) + 'k+';
        }
      }
      document.getElementById('income-display').textContent = '"' + p.incomeRange + '，在' + p.city + '打拼"';
      
      // 检查成就
      if (count === 5) {
        showAchievementPopup('💰', '小财迷', '涨工资5次！你对钱很有想法啊~');
      } else if (count === 15) {
        showAchievementPopup('🤑', '掉钱眼儿里了', '涨工资15次！你眼里只有钱了吧？');
      } else if (count >= 50) {
        // 50次直接结束游戏
        showMoneyGodEnding();
      }
    });

    // 姓名输入
    const nameInput = document.getElementById('name-input');
    nameInput.addEventListener('input', () => {
      p.name = nameInput.value || '匿名';
      // 自动调整输入框宽度
      nameInput.style.width = (nameInput.value.length * 28 + 20) + 'px';
    });
    nameInput.addEventListener('focus', () => {
      nameInput.style.borderBottom = '2px solid var(--gold)';
    });
    nameInput.addEventListener('blur', () => {
      nameInput.style.borderBottom = 'none';
    });

    // 随机姓名
    const NAMES = GAME_DATA.playerPool.names;
    document.getElementById('btn-random-name').addEventListener('click', () => {
      const others = NAMES.filter(n => n !== p.name);
      p.name = others[Math.floor(Math.random() * others.length)];
      nameInput.value = p.name;
      nameInput.style.width = (p.name.length * 28 + 20) + 'px';
    });

    // 年龄 +/-
    function updateAge() {
      const newFace = p.age >= 60 ? 50 + Math.floor((p.age - 60) / 5) * 100 : 50;
      document.getElementById('age-display').textContent = p.age + '岁';
      document.getElementById('initial-face').textContent = newFace;
    }
    
    document.getElementById('btn-age-plus').addEventListener('click', () => {
      if (p.age < 120) { p.age++; updateAge(); }
    });
    
    document.getElementById('btn-age-minus').addEventListener('click', () => {
      if (p.age > 10) { p.age--; updateAge(); }
    });

    // 退学：学历降一级
    document.getElementById('btn-dropout').addEventListener('click', () => {
      const idx = EDU_RANKS.indexOf(p.education);
      if (idx > 0) {
        p.education = EDU_RANKS[idx - 1];
        document.getElementById('edu-display').textContent = p.education;
        
        // 重新启用升学按钮
        document.getElementById('btn-upgrade').disabled = false;
        document.getElementById('btn-upgrade').textContent = '📈 升学';
        
        // 特殊提示
        if (p.education === '跟AI自学') {
          document.getElementById('btn-dropout').disabled = true;
          document.getElementById('btn-dropout').textContent = '🤖 AI是老师';
        }
      } else if (idx === 0) {
        // 已经是最低学历
        document.getElementById('btn-dropout').disabled = true;
        document.getElementById('btn-dropout').textContent = '🚫 到底了';
      } else {
        // 找不到当前学历，设为最低
        p.education = '跟AI自学';
        document.getElementById('edu-display').textContent = p.education;
        document.getElementById('btn-dropout').disabled = true;
        document.getElementById('btn-dropout').textContent = '🤖 AI是老师';
      }
    });

    // 升学：学历升一级
    document.getElementById('btn-upgrade').addEventListener('click', () => {
      const idx = EDU_RANKS.indexOf(p.education);
      if (idx >= 0 && idx < EDU_RANKS.length - 1) {
        p.education = EDU_RANKS[idx + 1];
        document.getElementById('edu-display').textContent = p.education;
        
        // 重新启用退学按钮
        document.getElementById('btn-dropout').disabled = false;
        document.getElementById('btn-dropout').textContent = '📉 退学';
        
        // 特殊提示
        if (p.education === '诺贝尔奖得主') {
          document.getElementById('btn-upgrade').disabled = true;
          document.getElementById('btn-upgrade').textContent = '🏆 巅峰了';
        }
      } else if (idx === EDU_RANKS.length - 1) {
        // 已经是最高学历
        document.getElementById('btn-upgrade').disabled = true;
        document.getElementById('btn-upgrade').textContent = '🏆 巅峰了';
      }
    });

    // 恋爱状态随机切换
    document.getElementById('btn-rel-random').addEventListener('click', () => {
      const others = RELATIONSHIP_POOL.filter(s => s !== p.relationshipStatus);
      p.relationshipStatus = others[Math.floor(Math.random() * others.length)];
      document.getElementById('rel-display').textContent = p.relationshipStatus;
    });

    // 改地址
    document.getElementById('btn-change-hometown').addEventListener('click', () => {
      const overlay = document.createElement('div');
      overlay.className = 'popup-overlay';
      overlay.innerHTML = `
        <div class="popup-card" style="max-width:360px;">
          <p style="font-family:var(--font-title);font-size:20px;color:var(--text-red);text-align:center;margin-bottom:16px;">选择老家</p>
          <div style="margin-bottom:12px;">
            <label style="font-size:12px;color:var(--text-muted);display:block;margin-bottom:4px;">省份</label>
            <select id="province-select" style="width:100%;padding:8px;border:1px solid var(--card-border);border-radius:6px;font-size:14px;font-family:var(--font-body);">
              <option value="">选择省份</option>
              ${CHINA_PROVINCES.map(prov => `<option value="${prov}">${prov}</option>`).join('')}
            </select>
          </div>
          <div style="margin-bottom:16px;">
            <label style="font-size:12px;color:var(--text-muted);display:block;margin-bottom:4px;">城市</label>
            <select id="city-select" style="width:100%;padding:8px;border:1px solid var(--card-border);border-radius:6px;font-size:14px;font-family:var(--font-body);" disabled>
              <option value="">先选择省份</option>
            </select>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <button class="btn-secondary" id="btn-cancel-address" style="padding:10px;">取消</button>
            <button class="btn-red" id="btn-confirm-address" style="padding:10px;">确认</button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
      
      const provinceSelect = document.getElementById('province-select');
      const citySelect = document.getElementById('city-select');
      
      provinceSelect.addEventListener('change', () => {
        const province = provinceSelect.value;
        if (province && PROVINCE_CITIES[province]) {
          citySelect.disabled = false;
          citySelect.innerHTML = '<option value="">选择城市</option>' + 
            PROVINCE_CITIES[province].map(city => `<option value="${city}">${city}</option>`).join('');
        } else if (province) {
          citySelect.disabled = false;
          citySelect.innerHTML = `<option value="${province}">${province}</option>`;
        } else {
          citySelect.disabled = true;
          citySelect.innerHTML = '<option value="">先选择省份</option>';
        }
      });
      
      document.getElementById('btn-cancel-address').addEventListener('click', () => overlay.remove());
      document.getElementById('btn-confirm-address').addEventListener('click', () => {
        const province = provinceSelect.value;
        const city = citySelect.value;
        if (province && city) {
          p.hometown = province + city;
          document.getElementById('hometown-display').textContent = p.hometown;
          overlay.remove();
        } else {
          alert('请选择完整的省份和城市');
        }
      });
      
      overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    });

    // 换身份：全部重新随机
    document.getElementById('btn-reroll').addEventListener('click', () => {
      engine.startGame();
      renderIdentityCard();
    });

    // 福字点击事件 - 红包雨
    const fuElement = document.querySelector('.id-card-seal');
    if (fuElement) {
      let fuClickCount = 0;
      fuElement.addEventListener('click', (e) => {
        e.stopPropagation(); // 防止事件冒泡
        fuClickCount++;
        
        console.log('福字被点击了！次数：', fuClickCount); // 调试信息
        
        // 福字旋转动画
        fuElement.style.transition = 'transform 0.3s ease';
        fuElement.style.transform = 'rotate(360deg) scale(1.2)';
        
        setTimeout(() => {
          fuElement.style.transform = 'rotate(0deg) scale(1)';
        }, 300);
        
        // 触发红包雨
        createRedPacketRain();
        
        // 特殊提示
        if (fuClickCount === 1) {
          showFuToast('🧧 恭喜发财！红包雨来啦！');
        } else if (fuClickCount === 5) {
          showFuToast('💰 财运亨通！你已经点了5次福字！');
        } else if (fuClickCount === 10) {
          showFuToast('💸 财神附体！你是真的爱钱啊！');
        }
      });
    }

    document.getElementById('btn-confirm-identity').addEventListener('click', () => {
      // 年龄判断
      if (p.age < 18) {
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay';
        overlay.innerHTML = `
          <div class="popup-card">
            <div style="font-size:48px;margin-bottom:12px;">👶</div>
            <p style="font-family:var(--font-title);font-size:24px;color:var(--text-red);margin-bottom:8px;">小孩儿那桌去！</p>
            <p style="color:var(--text-muted);font-size:14px;margin-bottom:20px;">未成年人不能上酒桌，去小孩儿那桌吃零食吧~</p>
            <button class="btn-red" id="btn-back-cover" style="width:100%;padding:12px;">回到封面</button>
          </div>
        `;
        document.body.appendChild(overlay);
        document.getElementById('btn-back-cover').addEventListener('click', () => {
          overlay.remove();
          renderCover();
          showScreen('cover');
        });
        return;
      }
      
      if (p.age >= 100) {
        const relatives = engine.state.relatives;
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay';
        overlay.innerHTML = `
          <div class="popup-card">
            <div style="font-size:48px;margin-bottom:12px;">🎊</div>
            <p style="font-family:var(--font-title);font-size:24px;color:var(--text-red);margin-bottom:8px;">寿星驾到！</p>
            <p style="color:var(--text-body);font-size:14px;margin-bottom:16px;line-height:1.8;">
              ${p.age}岁高寿！全家人都站起来向您敬酒！<br>
              ${relatives.map(r => `${r.name}：${r.name === '张大爷' ? '您老身体真硬朗！' : r.name === '李阿姨' ? '祝您福如东海！' : r.name === '王叔' ? '寿比南山！' : '新年快乐！'}`).join('<br>')}
            </p>
            <button class="btn-red" id="btn-back-cover-elder" style="width:100%;padding:12px;">回到封面</button>
          </div>
        `;
        document.body.appendChild(overlay);
        document.getElementById('btn-back-cover-elder').addEventListener('click', () => {
          overlay.remove();
          renderCover();
          showScreen('cover');
        });
        return;
      }
      
      // 设置初始面子值
      const initialFace = p.age >= 60 ? 50 + Math.floor((p.age - 60) / 5) * 100 : 50;
      engine.state.scores.face = initialFace;
      
      engine.transition('INTRO');
      renderIntro();
      showScreen('intro');
    });
  }

  // ── 亲戚介绍 ──
  async function renderIntro() {
    const relatives = engine.state.relatives;
    screens.intro.innerHTML = `
      <div class="card-main" style="margin-bottom:16px;padding:20px;">
        <h2 style="font-family:var(--font-title);font-size:26px;color:var(--text-red);text-align:center;margin-bottom:4px;">🏮 亲戚入座</h2>
        <p style="text-align:center;color:var(--text-muted);font-size:12px;">认识一下今天酒桌上的亲戚们</p>
      </div>
      <div id="intro-list" style="display:flex;flex-direction:column;gap:10px;"></div>
      <button class="btn-red" id="btn-intro-done" style="margin-top:20px;align-self:center;display:none;width:100%;padding:14px;font-size:17px;">开始匹配称呼 →</button>
    `;
    const list = document.getElementById('intro-list');
    const btn = document.getElementById('btn-intro-done');

    // 为每个亲戚生成slogan
    for (let i = 0; i < relatives.length; i++) {
      const r = relatives[i];
      
      setTimeout(async () => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.animation = 'slideIn 0.5s ease';
        card.innerHTML = `
          <div style="display:flex;align-items:center;gap:12px;">
            ${avatarHTML(r)}
            <div style="flex:1;">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:2px;">
                <span style="font-size:15px;font-weight:700;color:var(--text-dark);">${r.name}</span>
                <span class="tag">${r.title}</span>
              </div>
              <div style="font-size:12px;color:var(--text-muted);">${r.relation}</div>
              <div style="display:flex;gap:8px;margin-top:4px;">
                ${r.traits.map(t => `<span style="font-size:11px;color:var(--text-red);">✦ ${t}</span>`).join('')}
              </div>
              <div id="slogan-${i}" style="margin-top:6px;padding:6px 10px;background:var(--card-bg-alt);border-radius:6px;border-left:2px solid var(--gold);font-size:12px;color:var(--text-body);font-style:italic;min-height:32px;display:flex;align-items:center;">
                <span style="color:var(--text-muted);">💬 生成中...</span>
              </div>
            </div>
          </div>
        `;
        list.appendChild(card);
        
        // 调用AI生成slogan
        try {
          const response = await fetch(`${WORKER_URL}/api/slogan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ relative: r })
          });
          
          if (response.ok) {
            const data = await response.json();
            const sloganEl = document.getElementById(`slogan-${i}`);
            if (sloganEl && data.slogan) {
              sloganEl.innerHTML = `<span style="color:var(--text-body);">💬 "${data.slogan}"</span>`;
            }
          } else {
            // AI失败时显示默认文案
            const sloganEl = document.getElementById(`slogan-${i}`);
            if (sloganEl) {
              const defaultSlogans = [
                '过年了，一家人要团团圆圆！',
                '年轻人要多回家看看！',
                '新的一年，要更加努力！',
                '家和万事兴！',
                '身体健康最重要！'
              ];
              sloganEl.innerHTML = `<span style="color:var(--text-body);">💬 "${defaultSlogans[i % defaultSlogans.length]}"</span>`;
            }
          }
        } catch (error) {
          console.error('生成slogan失败:', error);
          const sloganEl = document.getElementById(`slogan-${i}`);
          if (sloganEl) {
            sloganEl.innerHTML = `<span style="color:var(--text-body);">💬 "过年好！"</span>`;
          }
        }
        
        if (i === relatives.length - 1) {
          setTimeout(() => { btn.style.display = 'block'; }, 500);
        }
      }, i * 700);
    }

    btn.addEventListener('click', () => {
      engine.transition('SEATING');
      renderSeating();
      showScreen('seating');
    });
  }

  // ── 座位匹配 ──
  function renderSeating() {
    const matcher = engine.seatingMatcher;
    matcher.assignSeats(engine.state.relatives);
    const titleOptions = engine.state.relatives.map(r => r.title);

    screens.seating.innerHTML = `
      <div class="card-main" style="margin-bottom:16px;padding:20px;">
        <h2 style="font-family:var(--font-title);font-size:26px;color:var(--text-red);text-align:center;margin-bottom:4px;">🪑 认亲戚</h2>
        <p style="text-align:center;color:var(--text-muted);font-size:12px;">为每个座位上的亲戚选择正确的称呼</p>
      </div>
      <div class="card" style="padding:24px;">
        <div id="seating-table" style="position:relative;width:280px;height:280px;margin:0 auto;">
          <div class="round-table" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);">🍽️</div>
        </div>
      </div>
      <button class="btn-red" id="btn-check-seats" style="margin-top:16px;align-self:center;display:none;width:100%;padding:14px;font-size:16px;">确认匹配</button>
      <button class="btn-secondary" id="btn-review" style="margin-top:10px;align-self:center;width:100%;padding:10px;font-size:13px;">📖 复习一下 <span style="color:var(--error);font-size:11px;">面子-5</span></button>
      <div id="seating-result" style="margin-top:12px;text-align:center;display:none;"></div>
      <button class="btn-red" id="btn-start-dialogue" style="margin-top:12px;align-self:center;display:none;width:100%;padding:14px;font-size:17px;">开始酒桌对话 →</button>
    `;

    const table = document.getElementById('seating-table');
    const seatPositions = [
      { top: '2%', left: '50%' },
      { top: '28%', left: '92%' },
      { top: '72%', left: '85%' },
      { top: '72%', left: '15%' },
      { top: '28%', left: '8%' }
    ];

    // 复习按钮
    document.getElementById('btn-review').addEventListener('click', () => {
      engine.adjustFace(-5);
      const relatives = engine.state.relatives;
      const overlay = document.createElement('div');
      overlay.className = 'popup-overlay';
      overlay.innerHTML = `
        <div class="popup-card" style="max-width:360px;text-align:left;">
          <p style="font-family:var(--font-title);font-size:20px;color:var(--text-red);text-align:center;margin-bottom:4px;">😅 妈，他们都是谁来着，我给忘了</p>
          <p style="text-align:center;color:var(--text-muted);font-size:12px;margin-bottom:16px;">面子 -5</p>
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${relatives.map(r => `
              <div style="display:flex;align-items:center;gap:10px;padding:8px 10px;background:var(--card-bg-alt);border-radius:var(--r-sm);">
                ${avatarHTML(r, 'avatar-frame-sm')}
                <div style="flex:1;">
                  <div style="font-size:14px;font-weight:700;color:var(--text-dark);">${r.name}</div>
                  <div style="font-size:11px;color:var(--text-muted);">${r.relation}</div>
                </div>
                <span class="tag" style="font-size:12px;">${r.title}</span>
              </div>
            `).join('')}
          </div>
          <button class="btn-red" id="btn-close-review" style="width:100%;margin-top:16px;padding:12px;font-size:15px;">记住了！</button>
        </div>
      `;
      document.body.appendChild(overlay);
      document.getElementById('btn-close-review').addEventListener('click', () => overlay.remove());
      overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    });

    const selections = {};
    seatPositions.forEach((pos, i) => {
      const rel = matcher.assignments.get(i);
      const seat = document.createElement('div');
      seat.style.cssText = `position:absolute;top:${pos.top};left:${pos.left};transform:translate(-50%,-50%);text-align:center;`;
      seat.innerHTML = `
        <div style="margin-bottom:4px;">${avatarHTML(rel, 'avatar-frame-sm')}</div>
        <select data-seat="${i}" style="background:#FFF;color:var(--text-body);border:1px solid var(--card-border);border-radius:6px;padding:4px 2px;font-size:11px;max-width:72px;font-family:var(--font-body);">
          <option value="">选称呼</option>
          ${titleOptions.map(t => `<option value="${t}">${t}</option>`).join('')}
        </select>
      `;
      table.appendChild(seat);
      seat.querySelector('select').addEventListener('change', (e) => {
        selections[i] = e.target.value;
        if (Object.keys(selections).length === 5 && Object.values(selections).every(v => v)) {
          document.getElementById('btn-check-seats').style.display = 'block';
        }
      });
    });

    document.getElementById('btn-check-seats').addEventListener('click', () => {
      Object.entries(selections).forEach(([si, title]) => matcher.submitMatch(parseInt(si), title));
      const result = matcher.evaluateAll();
      engine.state.seatingResult = { ...result };
      table.querySelectorAll('select').forEach(sel => {
        const si = parseInt(sel.dataset.seat);
        sel.disabled = true;
        sel.style.borderColor = result.results.get(si) ? 'var(--green)' : 'var(--error)';
        sel.style.borderWidth = '2px';
      });
      const scoreDelta = result.correct * GAME_DATA.scoringRules.seatCorrect + result.wrong * GAME_DATA.scoringRules.seatWrong;
      engine.adjustFace(scoreDelta);
      const resDiv = document.getElementById('seating-result');
      resDiv.style.display = 'block';
      resDiv.innerHTML = `<div class="card" style="display:inline-block;padding:10px 20px;"><span style="color:var(--green);">✓ ${result.correct}个正确</span> &nbsp; <span style="color:var(--error);">✗ ${result.wrong}个错误</span><br><span style="color:var(--text-red);font-family:var(--font-title);font-size:16px;">面子 ${scoreDelta >= 0 ? '+' : ''}${scoreDelta}</span></div>`;
      document.getElementById('btn-check-seats').style.display = 'none';
      document.getElementById('btn-start-dialogue').style.display = 'block';
    });

    document.getElementById('btn-start-dialogue').addEventListener('click', () => {
      engine.transition('DIALOGUE');
      renderDialogue();
      showScreen('dialogue');
    });
  }

  // ── 对话交互 ──
  function renderDialogue() {
    const ds = engine.dialogueSystem;
    const dk = engine.drinkingSystem;
    ds.startDialoguePhase();

    screens.dialogue.innerHTML = `
      <div class="card" style="padding:12px 16px;margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <span style="font-family:var(--font-title);font-size:20px;color:var(--text-red);">🗣️ 酒桌对话</span>
          <span id="round-counter" style="color:var(--text-muted);font-size:12px;">第 1/5 轮</span>
        </div>
        <div class="progress-bar"><div class="progress-bar-fill" id="round-progress" style="width:20%;"></div></div>
      </div>
      <div id="dialogue-avatars" style="display:flex;justify-content:center;gap:10px;margin-bottom:12px;flex-wrap:wrap;"></div>
      <div style="text-align:center;margin-bottom:10px;">
        <div style="display:inline-flex;align-items:end;gap:4px;">
          <div class="glass-container" id="glass-container" title="点击续酒">
            <div class="glass-fill" id="glass-fill" style="height:100%;"></div>
          </div>
          <span id="glass-alert" style="color:var(--warning);font-size:16px;display:none;animation:pulse 1s infinite;">⚠️</span>
        </div>
      </div>
      <div id="dialogue-area" class="card-dialogue" style="min-height:200px;">
        <p style="color:var(--text-muted);text-align:center;padding:40px 0;">点击亲戚头像开始对话</p>
      </div>
      <div id="toast-popup" style="display:none;"></div>
    `;

    const avatarArea = document.getElementById('dialogue-avatars');
    
    // 初始化亲戚酒杯状态
    const relativeGlassStates = {};
    engine.state.relatives.forEach((r, i) => {
      relativeGlassStates[i] = 'full';
    });
    
    engine.state.relatives.forEach((r, i) => {
      const av = document.createElement('div');
      av.style.cssText = 'text-align:center;position:relative;';
      av.innerHTML = `
        ${avatarHTML(r, '', true)}
        <div style="font-size:10px;color:#FFF;margin-top:3px;text-shadow:0 1px 3px rgba(0,0,0,0.5);">${r.title}</div>
        <div class="relative-glass-status" data-index="${i}" style="font-size:20px;margin-top:2px;">🍶</div>
      `;
      av.querySelector('.avatar-frame').addEventListener('click', () => handleDialogue(i));
      avatarArea.appendChild(av);
    });

    document.getElementById('glass-container').addEventListener('click', () => {
      if (dk.isGlassEmpty()) { dk.refillGlass(); dk.cancelEmptyTimer(); updateGlass(); }
    });

    function startAutoTimer() {
      ds.startAutoTimer(async () => {
        const idx = Math.floor(Math.random() * engine.state.relatives.length);
        await handleDialogue(idx);
      }, 10000);
    }

    // 打字机效果函数
    function typewriterEffect(element, text, speed = 50) {
      return new Promise((resolve) => {
        let index = 0;
        element.textContent = '';
        const timer = setInterval(() => {
          if (index < text.length) {
            element.textContent += text[index];
            index++;
          } else {
            clearInterval(timer);
            resolve();
          }
        }, speed);
      });
    }

    async function handleDialogue(relativeIndex) {
      if (ds.isPhaseComplete()) return;
      const area = document.getElementById('dialogue-area');
      area.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:40px 0;">🤔 亲戚正在想问题...</p>';
      const { relative, question, round } = await ds.triggerDialogue(relativeIndex);
      document.getElementById('round-counter').textContent = `第 ${round}/5 轮`;
      document.getElementById('round-progress').style.width = `${round * 20}%`;

      area.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
          ${avatarHTML(relative, 'avatar-frame-sm')}
          <div>
            <div style="font-size:15px;font-weight:700;color:var(--text-dark);">${relative.name}</div>
            <div style="font-size:11px;color:var(--text-muted);">${relative.title} · ${relative.traits[0]}</div>
          </div>
        </div>
        <div style="background:var(--card-bg-alt);border-left:3px solid var(--red);border-radius:0 var(--r-sm) var(--r-sm) 0;padding:14px 16px;margin-bottom:16px;">
          <p id="question-text" style="font-size:15px;line-height:1.7;color:var(--text-dark);">"</p>
        </div>
        <div id="options-area" style="display:flex;flex-direction:column;gap:8px;opacity:0;"></div>
        <div id="reaction-area" style="display:none;margin-top:14px;"></div>
        <div style="margin-top:20px;padding-top:16px;border-top:1px solid var(--card-border);">
          <div style="font-size:12px;color:var(--text-muted);margin-bottom:10px;">酒桌上的亲戚们：</div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
            ${engine.state.relatives.map((r, i) => `
              <div style="text-align:center;padding:6px;background:var(--card-bg-alt);border-radius:var(--r-sm);">
                ${avatarHTML(r, 'avatar-frame-sm')}
                <div style="font-size:10px;color:var(--text-muted);margin:3px 0;">${r.name}</div>
                <div class="relative-glass-status" data-index="${i}" style="font-size:20px;">🍶</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      // 打字机效果显示问题
      const questionTextEl = document.getElementById('question-text');
      await typewriterEffect(questionTextEl, question.text, 50);
      questionTextEl.textContent = '"' + question.text + '"';

      // 显示选项
      const optArea = document.getElementById('options-area');
      optArea.style.opacity = '1';
      optArea.style.transition = 'opacity 0.3s';
      question.options.forEach((opt, oi) => {
        const btn = document.createElement('button');
        btn.className = 'btn-option';
        btn.textContent = opt.text;
        btn.addEventListener('click', () => handleOptionSelect(question, oi, relative));
        optArea.appendChild(btn);
      });
    }

    function handleOptionSelect(question, optionIndex, relative) {
      const result = ds.selectOption(question, optionIndex);
      engine.adjustFace(result.faceChange);
      engine.adjustMood(result.moodChange);

      document.querySelectorAll('#options-area button').forEach((b, i) => {
        b.disabled = true;
        if (i === optionIndex) { b.style.borderLeftColor = 'var(--gold)'; b.style.background = '#FFF'; }
      });

      const reactionArea = document.getElementById('reaction-area');
      reactionArea.style.display = 'block';
      reactionArea.innerHTML = `
        <div class="card-reaction">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
            ${avatarHTML(relative, 'avatar-frame-sm')}
            <span style="color:var(--text-body);font-size:14px;line-height:1.5;">${result.reaction}</span>
          </div>
          <div style="display:flex;gap:16px;font-size:12px;padding-top:8px;border-top:1px solid var(--card-border);">
            <span>面子 <span style="color:${result.faceChange >= 0 ? 'var(--green)' : 'var(--error)'};">${result.faceChange >= 0 ? '+' : ''}${result.faceChange}</span></span>
            <span>心态 <span style="color:${result.moodChange >= 0 ? 'var(--green)' : 'var(--error)'};">${result.moodChange >= 0 ? '+' : ''}${result.moodChange}</span></span>
          </div>
        </div>
      `;

      if (Math.random() < 0.3 && !ds.isPhaseComplete()) setTimeout(() => showToastPopup(), 1500);

      if (dk.isGlassEmpty()) {
        document.getElementById('glass-alert').style.display = 'inline';
        dk.startEmptyTimer(() => {
          const r = engine.state.relatives[Math.floor(Math.random() * engine.state.relatives.length)];
          document.getElementById('dialogue-area').innerHTML += `<div class="card-reaction" style="margin-top:10px;border-left-color:var(--error);">${avatarHTML(r, 'avatar-frame-sm')} <span style="color:var(--error);margin-left:8px;">${r.name}：酒都不倒了？太不给面子了！</span></div>`;
          engine.adjustFace(-5);
        });
      }

      setTimeout(() => {
        if (ds.isPhaseComplete()) {
          setTimeout(() => { engine.transition('TOAST'); renderToast(); showScreen('toast'); }, 1000);
        } else { startAutoTimer(); }
      }, 2000);
    }

    function showToastPopup() {
      const popup = document.getElementById('toast-popup');
      const toastingRelative = engine.state.relatives[Math.floor(Math.random() * engine.state.relatives.length)];
      
      // 检查玩家酒杯是否为空
      if (dk.isGlassEmpty()) {
        // 酒杯空了，显示批评界面
        popup.style.display = 'block';
        popup.innerHTML = `
          <div class="popup-overlay">
            <div class="popup-card" style="max-width:420px;">
              <div style="margin-bottom:12px;">${avatarHTML(toastingRelative, 'avatar-frame-lg')}</div>
              <p style="font-family:var(--font-title);font-size:22px;color:var(--error);margin-bottom:4px;">😤 ${toastingRelative.name} 不高兴了！</p>
              <p style="color:var(--text-body);font-size:15px;margin-bottom:16px;line-height:1.8;">
                "我要敬你酒，你杯子都空了？<br>
                这是不给我面子啊！<br>
                赶紧满上！"
              </p>
              <div style="padding:12px;background:var(--card-bg-alt);border-radius:var(--r-sm);margin-bottom:16px;border-left:3px solid var(--error);">
                <span style="color:var(--error);font-weight:700;">面子 -15</span>
              </div>
              <button class="btn-red" id="btn-refill-now" style="width:100%;padding:12px;">赶紧续酒</button>
            </div>
          </div>
        `;
        
        // 扣面子
        engine.adjustFace(-15);
        
        document.getElementById('btn-refill-now').addEventListener('click', () => {
          // 续酒
          dk.refillGlass();
          updateGlass();
          
          // 续完酒后，继续敬酒流程
          popup.innerHTML = `
            <div class="popup-overlay">
              <div class="popup-card" style="max-width:420px;">
                <div style="margin-bottom:12px;">${avatarHTML(toastingRelative, 'avatar-frame-lg')}</div>
                <p style="font-family:var(--font-title);font-size:22px;color:var(--text-red);margin-bottom:4px;">${toastingRelative.name} 向你举杯！</p>
                <p style="color:var(--text-muted);font-size:13px;margin-bottom:20px;">"这还差不多，来，喝一个！"</p>
                <div style="display:flex;flex-direction:column;gap:8px;">
                  <button class="btn-option" data-choice="sip">🍵 抿一口 <span style="float:right;color:var(--text-muted);font-size:11px;">+5酒精 · 面子-5</span></button>
                  <button class="btn-option" data-choice="gulp">🍶 喝一大口 <span style="float:right;color:var(--text-muted);font-size:11px;">+15酒精</span></button>
                  <button class="btn-option" data-choice="bottoms_up">🍺 干杯！<span style="float:right;color:var(--text-muted);font-size:11px;">+30酒精 · 面子+10</span></button>
                </div>
              </div>
            </div>
          `;
          
          popup.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
              const result = dk.respondToast(btn.dataset.choice);
              updateGlass();
              
              if (result.isDrunk) { 
                popup.style.display = 'none'; 
                popup.innerHTML = '';
                renderResult(true); 
                showScreen('result'); 
                return;
              }
              
              // 喝完后显示倒酒界面
              showRefillScene(toastingRelative);
            });
          });
        });
        
        return;
      }
      
      // 酒杯有酒，正常敬酒流程
      popup.style.display = 'block';
      popup.innerHTML = `
        <div class="popup-overlay">
          <div class="popup-card" style="max-width:420px;">
            <div style="margin-bottom:12px;">${avatarHTML(toastingRelative, 'avatar-frame-lg')}</div>
            <p style="font-family:var(--font-title);font-size:22px;color:var(--text-red);margin-bottom:4px;">${toastingRelative.name} 向你举杯！</p>
            <p style="color:var(--text-muted);font-size:13px;margin-bottom:20px;">"来来来，喝一个！"</p>
            <div style="display:flex;flex-direction:column;gap:8px;">
              <button class="btn-option" data-choice="sip">🍵 抿一口 <span style="float:right;color:var(--text-muted);font-size:11px;">+5酒精 · 面子-5</span></button>
              <button class="btn-option" data-choice="gulp">🍶 喝一大口 <span style="float:right;color:var(--text-muted);font-size:11px;">+15酒精</span></button>
              <button class="btn-option" data-choice="bottoms_up">🍺 干杯！<span style="float:right;color:var(--text-muted);font-size:11px;">+30酒精 · 面子+10</span></button>
            </div>
          </div>
        </div>
      `;
      
      popup.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
          const result = dk.respondToast(btn.dataset.choice);
          updateGlass();
          
          if (result.isDrunk) { 
            popup.style.display = 'none'; 
            popup.innerHTML = '';
            renderResult(true); 
            showScreen('result'); 
            return;
          }
          
          // 喝完后显示倒酒界面
          showRefillScene(toastingRelative);
        });
      });
    }
    
    function showRefillScene(toastingRelative) {
      const popup = document.getElementById('toast-popup');
      const relatives = engine.state.relatives;
      const toastingIndex = relatives.indexOf(toastingRelative);
      
      // 更新对话界面的酒杯状态为空
      const glassStatusEl = document.querySelector(`.relative-glass-status[data-index="${toastingIndex}"]`);
      if (glassStatusEl) {
        glassStatusEl.textContent = '🥃';
      }
      
      // 初始化酒杯状态
      const glassStates = {};
      relatives.forEach((r, i) => {
        glassStates[i] = i === toastingIndex ? 'empty' : 'full';
      });
      
      popup.innerHTML = `
        <div class="popup-overlay">
          <div class="popup-card" style="max-width:460px;">
            <p style="font-family:var(--font-title);font-size:20px;color:var(--text-red);margin-bottom:8px;">🍶 ${toastingRelative.name} 干了，快倒酒！</p>
            <p style="color:var(--text-muted);font-size:12px;margin-bottom:16px;">点击空杯子给亲戚倒酒，<span id="refill-timer" style="color:var(--error);font-weight:700;">3</span>秒内完成</p>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px;" id="relatives-glasses">
              ${relatives.map((r, i) => `
                <div style="text-align:center;padding:8px;background:var(--card-bg-alt);border-radius:var(--r-sm);cursor:pointer;transition:all 0.2s;" data-index="${i}" class="relative-glass ${i === toastingIndex ? 'empty-glass' : ''}">
                  ${avatarHTML(r, 'avatar-frame-sm')}
                  <div style="font-size:11px;color:var(--text-muted);margin:4px 0;">${r.name}</div>
                  <div class="glass-icon" data-state="${glassStates[i]}" style="font-size:24px;">${glassStates[i] === 'full' ? '🍶' : '🥃'}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
      
      let timeLeft = 3;
      let refilled = false;
      
      const timerEl = document.getElementById('refill-timer');
      const countdown = setInterval(() => {
        timeLeft--;
        if (timerEl) timerEl.textContent = timeLeft;
        
        if (timeLeft <= 0) {
          clearInterval(countdown);
          if (!refilled) {
            // 超时，亲戚自己倒酒，扣面子
            engine.adjustFace(-10);
            popup.innerHTML = `
              <div class="popup-overlay">
                <div class="popup-card">
                  <div style="font-size:40px;margin-bottom:12px;">😤</div>
                  <p style="font-family:var(--font-title);font-size:20px;color:var(--error);margin-bottom:8px;">太慢了！</p>
                  <p style="color:var(--text-body);font-size:14px;margin-bottom:16px;">${toastingRelative.name}：你这孩子，连酒都不会倒！我自己来吧...</p>
                  <div style="padding:10px;background:var(--card-bg-alt);border-radius:var(--r-sm);margin-bottom:16px;">
                    <span style="color:var(--error);font-weight:700;">面子 -10</span>
                  </div>
                  <button class="btn-red" id="btn-close-refill" style="width:100%;padding:12px;">继续</button>
                </div>
              </div>
            `;
            document.getElementById('btn-close-refill').addEventListener('click', () => {
              // 倒酒失败，但酒杯还是满上了
              if (glassStatusEl) glassStatusEl.textContent = '🍶';
              popup.style.display = 'none';
              popup.innerHTML = '';
            });
          }
        }
      }, 1000);
      
      // 点击倒酒
      document.querySelectorAll('.relative-glass').forEach(el => {
        el.addEventListener('click', () => {
          const index = parseInt(el.dataset.index);
          const glassIcon = el.querySelector('.glass-icon');
          const state = glassIcon.dataset.state;
          
          if (state === 'empty' && !refilled) {
            refilled = true;
            clearInterval(countdown);
            glassIcon.textContent = '🍶';
            glassIcon.dataset.state = 'full';
            el.style.transform = 'scale(1.1)';
            setTimeout(() => { el.style.transform = 'scale(1)'; }, 200);
            
            // 倒酒成功，更新对话界面酒杯
            if (glassStatusEl) glassStatusEl.textContent = '🍶';
            
            setTimeout(() => {
              popup.innerHTML = `
                <div class="popup-overlay">
                  <div class="popup-card">
                    <div style="font-size:40px;margin-bottom:12px;">👍</div>
                    <p style="font-family:var(--font-title);font-size:20px;color:var(--green);margin-bottom:8px;">干得漂亮！</p>
                    <p style="color:var(--text-body);font-size:14px;margin-bottom:16px;">${toastingRelative.name}：这孩子懂事！</p>
                    <button class="btn-red" id="btn-close-refill-success" style="width:100%;padding:12px;">继续</button>
                  </div>
                </div>
              `;
              document.getElementById('btn-close-refill-success').addEventListener('click', () => {
                popup.style.display = 'none';
                popup.innerHTML = '';
              });
            }, 500);
          }
        });
      });
    }

    function updateGlass() {
      const fill = document.getElementById('glass-fill');
      const alert = document.getElementById('glass-alert');
      if (fill) fill.style.height = dk.getGlassLevel() + '%';
      if (alert) alert.style.display = dk.isGlassEmpty() ? 'inline' : 'none';
    }

    startAutoTimer();
  }

  // ── 祝酒辞 ──
  function renderToast() {
    const hasSpeech = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    screens.toast.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;min-height:70vh;justify-content:center;">
        <div class="card-main" style="width:100%;max-width:400px;">
          <div style="text-align:center;margin-bottom:16px;">
            <div style="font-size:40px;margin-bottom:4px;">🥂</div>
            <h2 style="font-family:var(--font-title);font-size:26px;color:var(--text-red);">祝酒辞</h2>
            <p style="color:var(--text-muted);font-size:12px;margin-top:4px;">长辈说："来，年轻人说两句祝福的话！"</p>
          </div>
          <div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap;">
            <span class="tag-gold tag">💡 提到亲戚名字加分</span>
            <span class="tag-gold tag">💡 提到亲戚特征加分</span>
          </div>
          <textarea id="toast-input" placeholder="在此输入你的祝酒辞..." style="width:100%;height:130px;background:#FFF;color:var(--text-dark);border:1px solid var(--card-border);border-radius:var(--r-sm);padding:12px;font-size:14px;font-family:var(--font-body);resize:none;transition:border-color 0.3s;" maxlength="500"></textarea>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;">
            <span style="font-size:11px;color:var(--text-muted);"><span id="toast-char-count">0</span>/500</span>
            ${hasSpeech ? '<button class="btn-secondary" id="btn-speech" style="padding:6px 14px;font-size:12px;">🎤 语音输入</button>' : ''}
          </div>
          <div id="speech-status" style="color:var(--text-muted);font-size:11px;margin-top:6px;display:none;"></div>
          <button class="btn-red" id="btn-submit-toast" style="width:100%;margin-top:16px;padding:14px;font-size:17px;">提交祝酒辞</button>
        </div>
      </div>
    `;

    const input = document.getElementById('toast-input');
    const charCount = document.getElementById('toast-char-count');
    input.addEventListener('input', () => { charCount.textContent = input.value.length; });
    input.addEventListener('focus', () => { input.style.borderColor = 'var(--gold)'; });
    input.addEventListener('blur', () => { input.style.borderColor = 'var(--card-border)'; });

    let audioBlob = null, mediaRecorder = null;
    if (hasSpeech) {
      document.getElementById('btn-speech').addEventListener('click', () => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SR();
        recognition.lang = 'zh-CN'; recognition.continuous = true; recognition.interimResults = true;
        const status = document.getElementById('speech-status');
        status.style.display = 'block'; status.textContent = '🔴 正在录音...';
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            const chunks = [];
            mediaRecorder.ondataavailable = e => chunks.push(e.data);
            mediaRecorder.onstop = () => { audioBlob = new Blob(chunks, { type: 'audio/webm' }); };
            mediaRecorder.start();
          }).catch(() => {});
        }
        recognition.onresult = (e) => { let t = ''; for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript; input.value = t.slice(0, 500); charCount.textContent = input.value.length; };
        recognition.onerror = () => { status.textContent = '语音识别失败，请使用键盘输入'; };
        recognition.onend = () => { status.textContent = '录音结束'; if (mediaRecorder && mediaRecorder.state === 'recording') mediaRecorder.stop(); };
        recognition.start();
        setTimeout(() => { try { recognition.stop(); } catch {} }, 15000);
      });
    }

    document.getElementById('btn-submit-toast').addEventListener('click', async () => {
      const text = input.value.trim();
      if (!text) { input.style.borderColor = 'var(--error)'; return; }
      const submitBtn = document.getElementById('btn-submit-toast');
      submitBtn.disabled = true;
      submitBtn.textContent = '🤔 AI 正在品鉴...';
      engine.state.toastText = text;
      engine.state.toastAudioBlob = audioBlob;
      const scoreResult = await aiProvider.scoreToast(text, engine.state.relatives);
      engine.adjustFace(scoreResult.score);
      engine.endGame('normal');
      renderResult(false, scoreResult);
      showScreen('result');
    });
  }

  // ── 结算 ──
  function renderResult(isDrunk = false, toastScore = null) {
    const s = engine.state.scores;
    const achievements = engine.state.achievements;
    const p = engine.state.player;

    screens.result.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;padding:16px 0;">
        <div id="result-card" class="card-main" style="width:100%;max-width:400px;">
          <div style="text-align:center;margin-bottom:16px;">
            <div style="font-size:40px;margin-bottom:4px;">${isDrunk ? '🍺' : '🎊'}</div>
            <h2 style="font-family:var(--font-title);font-size:28px;color:var(--text-red);">${isDrunk ? '不省人事...' : '酒桌战报'}</h2>
            <div style="font-size:12px;color:var(--text-muted);margin-top:4px;">${p.name} · ${p.age}岁 · ${p.job}</div>
          </div>

          <div class="stats-row" style="margin-bottom:16px;">
            <div class="stat-col"><div class="stat-lbl">😎 面子</div><div class="stat-num" style="font-size:30px;">${s.face}</div></div>
            <div class="stat-col"><div class="stat-lbl">🧠 心态</div><div class="stat-num" style="font-size:30px;">${s.mood}</div></div>
            <div class="stat-col"><div class="stat-lbl">🍺 酒精</div><div class="stat-num" style="font-size:30px;${s.alcohol >= 100 ? 'color:var(--error);' : ''}">${s.alcohol}</div></div>
          </div>

          ${toastScore ? `
            <div style="text-align:center;margin-bottom:12px;">
              <span class="tag-gold tag">🥂 祝酒辞加分：+${toastScore.score}</span>
            </div>
            ${toastScore.comment ? `<div style="text-align:center;margin-bottom:12px;padding:10px 16px;background:var(--card-bg-alt);border-radius:var(--r-sm);"><span style="font-size:13px;color:var(--text-body);">🤖 AI 点评：${toastScore.comment}</span></div>` : ''}
            ${toastScore.breakdown && toastScore.breakdown.sincerity != null ? `
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
                <div style="text-align:center;padding:8px;background:var(--card-bg-alt);border-radius:var(--r-sm);"><div style="font-size:11px;color:var(--text-muted);">真诚度</div><div style="font-size:18px;font-weight:700;color:var(--text-red);">${toastScore.breakdown.sincerity}</div></div>
                <div style="text-align:center;padding:8px;background:var(--card-bg-alt);border-radius:var(--r-sm);"><div style="font-size:11px;color:var(--text-muted);">幽默感</div><div style="font-size:18px;font-weight:700;color:var(--text-red);">${toastScore.breakdown.humor}</div></div>
                <div style="text-align:center;padding:8px;background:var(--card-bg-alt);border-radius:var(--r-sm);"><div style="font-size:11px;color:var(--text-muted);">贴合度</div><div style="font-size:18px;font-weight:700;color:var(--text-red);">${toastScore.breakdown.relevance}</div></div>
                <div style="text-align:center;padding:8px;background:var(--card-bg-alt);border-radius:var(--r-sm);"><div style="font-size:11px;color:var(--text-muted);">文采</div><div style="font-size:18px;font-weight:700;color:var(--text-red);">${toastScore.breakdown.eloquence}</div></div>
              </div>
            ` : ''}
          ` : ''}

          <div class="divider"><span>🏆 成就</span></div>
          <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:8px;">
            ${achievements.length > 0
              ? achievements.map(a => `<div class="achievement-card"><div style="font-size:24px;margin-bottom:2px;">${a.icon}</div><div style="font-size:12px;font-weight:700;color:var(--text-red);">${a.name}</div><div style="font-size:10px;color:var(--text-muted);">${a.description}</div></div>`).join('')
              : '<p style="color:var(--text-muted);font-size:13px;padding:12px;">没有解锁任何成就</p>'
            }
          </div>
        </div>

        <div style="display:flex;gap:10px;margin-top:20px;flex-wrap:wrap;justify-content:center;">
          <button class="btn-secondary" id="btn-download-img">📷 保存战报</button>
          ${engine.state.toastAudioBlob ? '<button class="btn-secondary" id="btn-download-audio">🎤 下载录音</button>' : ''}
          <button class="btn-red" id="btn-replay" style="padding:12px 36px;font-size:16px;">🔄 再来一局</button>
        </div>
      </div>
    `;

    document.getElementById('btn-download-img').addEventListener('click', async () => {
      const rg = engine.resultGenerator;
      const dataUrl = await rg.generateResultCard('result-card');
      if (dataUrl) rg.downloadImage(dataUrl);
    });
    const audioBtn = document.getElementById('btn-download-audio');
    if (audioBtn) audioBtn.addEventListener('click', () => engine.resultGenerator.downloadAudio(engine.state.toastAudioBlob));
    document.getElementById('btn-replay').addEventListener('click', () => { engine.resetGame(); renderCover(); showScreen('cover'); });
  }

  // ── BGM ──
  let bgmPlaying = false;
  bgmToggle.addEventListener('click', () => { bgmPlaying = !bgmPlaying; bgmToggle.textContent = bgmPlaying ? '🔊' : '🔇'; });

  // ── 启动 ──
  renderCover();
  showScreen('cover');
})();
