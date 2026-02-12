// ============================================================
// 酒桌模拟器 - 春节版 | 游戏数据配置
// 所有内容数据集中管理，便于扩展
// ============================================================

const GAME_DATA = {

  // ── 封面文案 ──
  coverText: {
    title: '酒桌模拟器',
    subtitle: '春节特别版',
    description: '回家过年，亲戚围坐。是光宗耀祖，还是家谱除名？在这个充满"人情世故"的酒桌上，请开始你的表演。',
    startButton: '入 座'
  },

  // ── 评分规则 ──
  scoringRules: {
    seatCorrect: 5,
    seatWrong: -3,
    toastBasicWordScore: 20,
    toastBasicWordMax: 60,
    toastNameScore: 50,
    toastNameMax: 250,
    toastTraitScore: 30,
    toastTraitMax: 150,
    toastLengthScore: 10,
    toastLengthPer: 50,
    toastLengthMax: 40,
    toastTotalMax: 500,
    drinkSip: 5,
    drinkGulp: 15,
    drinkBottomsUp: 30,
    sipFaceChange: -5,
    bottomsUpFaceChange: 10
  },

  // ── 玩家身份池 ──
  playerPool: {
    names: ['李明', '张伟', '王芳', '刘洋', '陈静', '赵磊', '周婷', '吴鹏', '孙悦', '杨帆'],
    jobs: ['互联网程序员', '产品经理', '自由职业', 'UI设计师', '新媒体运营', '外企白领', '考研党', '公务员', '创业者', '教师'],
    hometowns: ['河南信阳', '湖南长沙', '四川成都', '山东济南', '安徽合肥', '江西南昌', '湖北武汉', '广东潮汕', '福建泉州', '东北哈尔滨'],
    cities: ['北京', '上海', '深圳', '杭州', '广州', '成都', '南京', '苏州'],
    incomeRanges: ['月薪5k-8k', '月薪8k-15k', '月薪15k-30k', '月薪30k+'],
    relationshipStatuses: ['单身', '恋爱中', '已婚'],
    educations: ['本科', '985本科', '硕士', '985硕士', '海归硕士', '大专']
  },

  // ── 祝福关键词 ──
  festiveWords: ['新年好', '恭喜发财', '万事如意', '身体健康', '阖家欢乐', '心想事成', '大吉大利', '龙马精神', '步步高升', '财源广进'],


  // ── 亲戚模板库（20+） ──
  relatives: [
    { id: 'uncle_rich', name: '王大伯', title: '大伯', relation: '爸爸的大哥', type: '长辈_男', traits: ['爱炫耀', '好面子'], traitKeywords: ['事业', '成功', '有出息'], questionTags: ['职业收入', '攀比'], avatar: '👨‍💼', avatarBg: 'linear-gradient(135deg, #4A1A0A, #7A2E15)' },
    { id: 'aunt_matchmaker', name: '李大姑', title: '大姑', relation: '爸爸的姐姐', type: '长辈_女', traits: ['热心肠', '爱催婚'], traitKeywords: ['婚姻', '对象', '幸福'], questionTags: ['催婚催生', '传统寒暄'], avatar: '👩‍🦱', avatarBg: 'linear-gradient(135deg, #6B1D3A, #A0305A)' },
    { id: 'uncle_second', name: '张二叔', title: '二叔', relation: '爸爸的弟弟', type: '长辈_男', traits: ['爱喝酒', '豪爽'], traitKeywords: ['酒量', '豪气', '兄弟'], questionTags: ['传统寒暄', '职业收入'], avatar: '🧔', avatarBg: 'linear-gradient(135deg, #3D2B1F, #6B4226)' },
    { id: 'aunt_second', name: '赵二姨', title: '二姨', relation: '妈妈的姐姐', type: '长辈_女', traits: ['精明', '爱攀比'], traitKeywords: ['孩子', '教育', '优秀'], questionTags: ['攀比', '催婚催生'], avatar: '👩‍🏫', avatarBg: 'linear-gradient(135deg, #4A2040, #7A3568)' },
    { id: 'uncle_inlaw', name: '陈姑父', title: '姑父', relation: '大姑的丈夫', type: '长辈_男', traits: ['沉稳', '关心晚辈'], traitKeywords: ['前途', '稳定', '踏实'], questionTags: ['职业收入', '生活方式'], avatar: '👨‍🔬', avatarBg: 'linear-gradient(135deg, #1A3A4A, #2A5A6A)' },
    { id: 'aunt_mother_inlaw', name: '周舅妈', title: '舅妈', relation: '舅舅的妻子', type: '长辈_女', traits: ['八卦', '消息灵通'], traitKeywords: ['消息', '听说', '邻居'], questionTags: ['催婚催生', '攀比'], avatar: '💁‍♀️', avatarBg: 'linear-gradient(135deg, #5A2040, #8A3060)' },
    { id: 'uncle_maternal', name: '刘舅舅', title: '舅舅', relation: '妈妈的弟弟', type: '长辈_男', traits: ['务实', '关心教育'], traitKeywords: ['学习', '考试', '上进'], questionTags: ['职业收入', '社交热点'], avatar: '👨‍💻', avatarBg: 'linear-gradient(135deg, #1A2A4A, #2A4A6A)' },
    { id: 'grandma', name: '孙奶奶', title: '奶奶', relation: '爸爸的妈妈', type: '长辈_女', traits: ['慈祥', '催婚达人'], traitKeywords: ['孙子', '结婚', '传宗接代'], questionTags: ['催婚催生', '传统寒暄'], avatar: '👵', avatarBg: 'linear-gradient(135deg, #5A3A1A, #8A5A2A)' },
    { id: 'grandpa', name: '孙爷爷', title: '爷爷', relation: '爸爸的爸爸', type: '长辈_男', traits: ['威严', '传统'], traitKeywords: ['家族', '传统', '规矩'], questionTags: ['传统寒暄', '职业收入'], avatar: '👴', avatarBg: 'linear-gradient(135deg, #3A2A1A, #5A4A2A)' },
    { id: 'aunt_third', name: '吴三姨', title: '三姨', relation: '妈妈的妹妹', type: '长辈_女', traits: ['时髦', '爱聊科技'], traitKeywords: ['手机', '网络', '潮流'], questionTags: ['社交热点', '生活方式'], avatar: '👩‍🎤', avatarBg: 'linear-gradient(135deg, #4A1A5A, #7A2A8A)' },
    { id: 'cousin_brother_tech', name: '王大表哥', title: '大表哥', relation: '大伯的儿子', type: '同辈_男', traits: ['IT精英', '年薪百万'], traitKeywords: ['互联网', '大厂', '股票'], questionTags: ['职业收入', '社交热点'], avatar: '🧑‍💻', avatarBg: 'linear-gradient(135deg, #0A2A3A, #1A4A5A)' },
    { id: 'cousin_sister_married', name: '李表姐', title: '表姐', relation: '大姑的女儿', type: '同辈_女', traits: ['已婚已育', '人生赢家'], traitKeywords: ['宝宝', '老公', '幸福'], questionTags: ['催婚催生', '攀比'], avatar: '👩‍👧', avatarBg: 'linear-gradient(135deg, #6A1A2A, #9A2A4A)' },
    { id: 'cousin_brother_civil', name: '张堂哥', title: '堂哥', relation: '二叔的儿子', type: '同辈_男', traits: ['公务员', '稳定'], traitKeywords: ['体制内', '铁饭碗', '福利'], questionTags: ['职业收入', '生活方式'], avatar: '👨‍⚖️', avatarBg: 'linear-gradient(135deg, #1A2A1A, #2A4A2A)' },
    { id: 'cousin_sister_young', name: '赵表妹', title: '表妹', relation: '二姨的女儿', type: '同辈_女', traits: ['在读研究生', '学霸'], traitKeywords: ['考研', '论文', '学术'], questionTags: ['职业收入', '社交热点'], avatar: '👩‍🎓', avatarBg: 'linear-gradient(135deg, #2A1A4A, #4A2A6A)' },
    { id: 'cousin_brother_biz', name: '陈堂弟', title: '堂弟', relation: '姑父的儿子', type: '同辈_男', traits: ['做生意', '社会人'], traitKeywords: ['生意', '赚钱', '人脉'], questionTags: ['职业收入', '生活方式'], avatar: '🕴️', avatarBg: 'linear-gradient(135deg, #2A2A2A, #4A4A4A)' },
    { id: 'uncle_neighbor', name: '钱叔叔', title: '钱叔', relation: '爸爸的发小', type: '长辈_男', traits: ['爱劝酒', '自来熟'], traitKeywords: ['喝酒', '感情', '兄弟'], questionTags: ['传统寒暄', '职业收入'], avatar: '🍻', avatarBg: 'linear-gradient(135deg, #4A3A0A, #7A5A1A)' },
    { id: 'aunt_neighbor', name: '郑阿姨', title: '郑阿姨', relation: '妈妈的闺蜜', type: '长辈_女', traits: ['热情', '爱打听'], traitKeywords: ['打听', '关心', '邻居'], questionTags: ['催婚催生', '生活方式'], avatar: '🤱', avatarBg: 'linear-gradient(135deg, #5A2A2A, #8A4A4A)' },
    { id: 'cousin_sister_abroad', name: '周表姐', title: '周表姐', relation: '舅舅的女儿', type: '同辈_女', traits: ['海归', '见多识广'], traitKeywords: ['留学', '国外', '见识'], questionTags: ['社交热点', '攀比'], avatar: '✈️', avatarBg: 'linear-gradient(135deg, #1A3A5A, #2A5A8A)' },
    { id: 'cousin_brother_army', name: '刘表哥', title: '刘表哥', relation: '舅舅的儿子', type: '同辈_男', traits: ['退伍军人', '正直'], traitKeywords: ['部队', '纪律', '锻炼'], questionTags: ['传统寒暄', '职业收入'], avatar: '💂', avatarBg: 'linear-gradient(135deg, #2A3A1A, #4A5A2A)' },
    { id: 'aunt_rich', name: '马姨妈', title: '姨妈', relation: '妈妈的大姐', type: '长辈_女', traits: ['有钱', '爱显摆'], traitKeywords: ['名牌', '旅游', '投资'], questionTags: ['攀比', '生活方式'], avatar: '💎', avatarBg: 'linear-gradient(135deg, #3A1A4A, #6A2A7A)' },
    { id: 'uncle_funny', name: '黄叔叔', title: '黄叔', relation: '爸爸的表弟', type: '长辈_男', traits: ['幽默', '段子手'], traitKeywords: ['搞笑', '开心', '乐呵'], questionTags: ['社交热点', '传统寒暄'], avatar: '😄', avatarBg: 'linear-gradient(135deg, #5A4A0A, #8A7A1A)' },
    { id: 'cousin_sister_beauty', name: '杨表妹', title: '杨表妹', relation: '三姨的女儿', type: '同辈_女', traits: ['网红', '爱自拍'], traitKeywords: ['直播', '粉丝', '流量'], questionTags: ['社交热点', '生活方式'], avatar: '📱', avatarBg: 'linear-gradient(135deg, #5A1A3A, #8A2A5A)' }
  ],


  // ── 问题模板库（60+） ──
  questions: [
    // === 催婚催生类 ===
    { id: 'q_marry_1', text: '你表姐都生二胎了，你连对象都没有？', tags: ['催婚催生', '热梗'], relativeTypes: ['长辈_女', '长辈_男'], playerConditions: { relationshipStatus: '单身' },
      options: [
        { text: '哈哈，缘分还没到嘛，不着急~', type: 'compliant', faceChange: 8, moodChange: -5, reaction: '缘分这东西...你都多大了还不急？' },
        { text: '我在等一个灵魂契合的人', type: 'neutral', faceChange: 3, moodChange: 3, reaction: '灵魂契合？先找个能过日子的吧！' },
        { text: '一个人挺好的，自由自在', type: 'rebellious', faceChange: -10, moodChange: 10, reaction: '你这孩子...唉...' },
        { text: '我已经和工作结婚了', type: 'rebellious', faceChange: -8, moodChange: 12, reaction: '工作能给你生孩子吗？' }
      ]},
    { id: 'q_marry_2', text: '隔壁小王都结婚了，你什么时候带对象回来？', tags: ['催婚催生', '热梗'], relativeTypes: ['长辈_女', '长辈_男'], playerConditions: { relationshipStatus: '单身' },
      options: [
        { text: '快了快了，明年一定带回来', type: 'compliant', faceChange: 10, moodChange: -8, reaction: '这话你去年也说了！' },
        { text: '小王那对象还不如我单着呢', type: 'rebellious', faceChange: -12, moodChange: 15, reaction: '你这嘴...真是的！' },
        { text: '正在努力中，您放心', type: 'neutral', faceChange: 5, moodChange: -3, reaction: '努力就好，别太挑了' }
      ]},
    { id: 'q_marry_3', text: '什么时候要孩子啊？趁年轻赶紧生', tags: ['催婚催生', '热梗'], relativeTypes: ['长辈_女'], playerConditions: { relationshipStatus: '已婚' },
      options: [
        { text: '在计划了，顺其自然', type: 'compliant', faceChange: 8, moodChange: -6, reaction: '别计划了，赶紧行动！' },
        { text: '现在养孩子成本太高了', type: 'neutral', faceChange: 0, moodChange: 5, reaction: '哪有那么夸张，我们那时候不也过来了' },
        { text: '我们丁克，不打算要', type: 'rebellious', faceChange: -15, moodChange: 12, reaction: '什么？！你爸妈知道吗？' }
      ]},
    { id: 'q_marry_4', text: '二胎政策这么好不考虑吗？', tags: ['催婚催生', '热梗'], relativeTypes: ['长辈_女', '长辈_男'], playerConditions: {},
      options: [
        { text: '有在考虑呢，谢谢关心', type: 'compliant', faceChange: 8, moodChange: -5, reaction: '考虑什么，直接生！' },
        { text: '一个都养不起，还二胎？', type: 'rebellious', faceChange: -10, moodChange: 10, reaction: '你这孩子怎么这么悲观' },
        { text: '等经济条件好一点再说', type: 'neutral', faceChange: 3, moodChange: 0, reaction: '条件永远不会完全准备好的' }
      ]},
    { id: 'q_marry_5', text: '你对象是哪里人？做什么工作的？', tags: ['催婚催生'], relativeTypes: ['长辈_女', '长辈_男'], playerConditions: { relationshipStatus: '恋爱中' },
      options: [
        { text: '本地人，在大公司上班，条件不错', type: 'compliant', faceChange: 12, moodChange: -5, reaction: '哎呀，那挺好的！什么时候带来看看？' },
        { text: '外地的，我们感情很好', type: 'neutral', faceChange: 3, moodChange: 3, reaction: '外地的啊...远嫁/远娶可不容易' },
        { text: '这是我的隐私，不方便说', type: 'rebellious', faceChange: -8, moodChange: 10, reaction: '问一下都不行？这孩子...' }
      ]},
    { id: 'q_marry_6', text: '你看人家小李，孩子都上幼儿园了', tags: ['催婚催生', '攀比'], relativeTypes: ['长辈_女'], playerConditions: { relationshipStatus: '单身' },
      options: [
        { text: '是啊，人家确实厉害', type: 'compliant', faceChange: 5, moodChange: -10, reaction: '你也加把劲啊！' },
        { text: '每个人有自己的节奏', type: 'neutral', faceChange: 0, moodChange: 5, reaction: '节奏再慢也得有个谱啊' },
        { text: '那您帮我介绍一个呗', type: 'rebellious', faceChange: -5, moodChange: 8, reaction: '你这是在将我的军？' }
      ]},

    // === 工作收入类 ===
    { id: 'q_work_1', text: '月薪多少啊？在大城市够花吗？', tags: ['职业收入', '热梗'], relativeTypes: ['长辈_男', '长辈_女'], playerConditions: {},
      options: [
        { text: '还行，够生活的，谢谢关心', type: 'compliant', faceChange: 5, moodChange: -5, reaction: '够生活可不行，得存钱啊！' },
        { text: '刚好饿不死的水平', type: 'neutral', faceChange: 0, moodChange: 5, reaction: '哈哈，年轻人都这么说' },
        { text: '这个不太方便说吧...', type: 'rebellious', faceChange: -8, moodChange: 8, reaction: '问一下怎么了，又不是外人' }
      ]},
    { id: 'q_work_2', text: '考公了吗？体制内多稳定啊', tags: ['职业收入', '热梗'], relativeTypes: ['长辈_男', '长辈_女'], playerConditions: {},
      options: [
        { text: '有在准备，争取上岸', type: 'compliant', faceChange: 12, moodChange: -8, reaction: '好好准备，考上了全家光荣！' },
        { text: '我觉得现在的工作也挺好', type: 'neutral', faceChange: 3, moodChange: 3, reaction: '私企哪有体制内稳定...' },
        { text: '我不想进体制内，太无聊了', type: 'rebellious', faceChange: -10, moodChange: 10, reaction: '无聊？稳定才是最重要的！' }
      ]},
    { id: 'q_work_3', text: '考研上岸了吗？现在本科不够用了', tags: ['职业收入', '热梗'], relativeTypes: ['长辈_男', '长辈_女', '同辈_女'], playerConditions: {},
      options: [
        { text: '上岸了/在准备中，感谢关心', type: 'compliant', faceChange: 10, moodChange: -5, reaction: '好样的，继续加油！' },
        { text: '工作经验比学历重要', type: 'neutral', faceChange: 0, moodChange: 5, reaction: '话是这么说，但学历是敲门砖啊' },
        { text: '卷不动了，躺平了', type: 'rebellious', faceChange: -12, moodChange: 12, reaction: '年纪轻轻怎么就躺平了！' }
      ]},
    { id: 'q_work_4', text: '大厂还是体制内？你选哪个？', tags: ['职业收入', '热梗'], relativeTypes: ['同辈_男', '同辈_女', '长辈_男'], playerConditions: {},
      options: [
        { text: '各有各的好，看个人选择', type: 'neutral', faceChange: 3, moodChange: 3, reaction: '你这回答跟没说一样' },
        { text: '当然是体制内，铁饭碗', type: 'compliant', faceChange: 10, moodChange: -8, reaction: '这孩子有眼光！' },
        { text: '大厂赚得多，趁年轻拼一把', type: 'rebellious', faceChange: -5, moodChange: 8, reaction: '35岁以后呢？' }
      ]},
    { id: 'q_work_5', text: '35岁危机你怕不怕？', tags: ['职业收入', '热梗'], relativeTypes: ['同辈_男', '长辈_男'], playerConditions: {},
      options: [
        { text: '有点担心，在提前规划', type: 'compliant', faceChange: 8, moodChange: -5, reaction: '有危机意识是好事' },
        { text: '到时候再说吧，车到山前必有路', type: 'neutral', faceChange: 0, moodChange: 5, reaction: '你这心态倒是挺好' },
        { text: '不怕，我准备35岁退休', type: 'rebellious', faceChange: -8, moodChange: 12, reaction: '退休？你做梦呢吧' }
      ]},
    { id: 'q_work_6', text: '被裁员了吗？听说互联网大裁员', tags: ['职业收入', '热梗'], relativeTypes: ['长辈_男', '长辈_女'], playerConditions: { job: '互联网程序员' },
      options: [
        { text: '没有没有，公司挺稳定的', type: 'compliant', faceChange: 8, moodChange: -5, reaction: '那就好，现在工作不好找' },
        { text: '裁了也不怕，技术在手', type: 'neutral', faceChange: 3, moodChange: 5, reaction: '年轻人有底气是好事' },
        { text: '您消息挺灵通啊', type: 'rebellious', faceChange: -8, moodChange: 8, reaction: '我这不是关心你嘛！' }
      ]},
    { id: 'q_work_7', text: '一年能存多少钱？', tags: ['职业收入'], relativeTypes: ['长辈_男', '长辈_女'], playerConditions: {},
      options: [
        { text: '存了一些，在努力攒钱', type: 'compliant', faceChange: 8, moodChange: -5, reaction: '年轻人要学会理财' },
        { text: '月光族，花完就没了', type: 'neutral', faceChange: -3, moodChange: 5, reaction: '这可不行，得学会存钱' },
        { text: '负债中，花呗还没还完', type: 'rebellious', faceChange: -12, moodChange: 8, reaction: '什么？！你爸妈知道吗？' }
      ]},
    { id: 'q_work_8', text: '年终奖发了多少？', tags: ['职业收入'], relativeTypes: ['同辈_男', '长辈_男'], playerConditions: {},
      options: [
        { text: '还可以，公司效益不错', type: 'compliant', faceChange: 10, moodChange: -5, reaction: '不错不错，比你堂哥强' },
        { text: '今年没有年终奖', type: 'neutral', faceChange: -5, moodChange: 0, reaction: '啊？那你们公司不太行啊' },
        { text: '这个不方便透露', type: 'rebellious', faceChange: -8, moodChange: 8, reaction: '自家人问问都不行？' }
      ]},

    // === 买房类 ===
    { id: 'q_house_1', text: '买房了吗？现在房价跌了是不是该抄底？', tags: ['生活方式', '热梗'], relativeTypes: ['长辈_男', '长辈_女'], playerConditions: {},
      options: [
        { text: '在看了，争取今年定下来', type: 'compliant', faceChange: 10, moodChange: -8, reaction: '对，早买早安心！' },
        { text: '买不起，先租着吧', type: 'neutral', faceChange: -3, moodChange: 5, reaction: '租房不是长久之计啊' },
        { text: '不买，房子是用来住的不是炒的', type: 'rebellious', faceChange: -10, moodChange: 10, reaction: '不买房以后结婚怎么办？' }
      ]},
    { id: 'q_house_2', text: '房贷还了多少了？压力大不大？', tags: ['生活方式', '热梗'], relativeTypes: ['长辈_男', '同辈_男'], playerConditions: {},
      options: [
        { text: '还在还，慢慢来', type: 'compliant', faceChange: 5, moodChange: -5, reaction: '年轻人有房贷很正常' },
        { text: '压力山大，每月工资一半交房贷', type: 'neutral', faceChange: 0, moodChange: 0, reaction: '都这样，熬过去就好了' },
        { text: '后悔买了，不如租房自在', type: 'rebellious', faceChange: -10, moodChange: 8, reaction: '胡说，房子是最好的投资！' }
      ]},
    { id: 'q_house_3', text: '学区房看了没？得提前准备', tags: ['生活方式', '热梗'], relativeTypes: ['长辈_女', '同辈_女'], playerConditions: {},
      options: [
        { text: '有在关注，教育很重要', type: 'compliant', faceChange: 10, moodChange: -8, reaction: '对，不能让孩子输在起跑线上' },
        { text: '还早呢，孩子都没有', type: 'neutral', faceChange: 0, moodChange: 5, reaction: '不早了，好学区房抢手得很' },
        { text: '学区房是智商税', type: 'rebellious', faceChange: -12, moodChange: 12, reaction: '你这想法太危险了！' }
      ]},

    // === 攀比类 ===
    { id: 'q_compare_1', text: '你堂哥年薪百万了，你呢？', tags: ['攀比', '热梗'], relativeTypes: ['长辈_男', '长辈_女'], playerConditions: {},
      options: [
        { text: '堂哥确实厉害，我还在努力', type: 'compliant', faceChange: 5, moodChange: -10, reaction: '向你堂哥学习！' },
        { text: '每个人赛道不同，没法比', type: 'neutral', faceChange: 0, moodChange: 5, reaction: '话是这么说...' },
        { text: '年薪百万也不一定开心', type: 'rebellious', faceChange: -8, moodChange: 10, reaction: '有钱还能不开心？' }
      ]},
    { id: 'q_compare_2', text: '你表姐在字节跳动，待遇可好了', tags: ['攀比', '热梗'], relativeTypes: ['长辈_女', '同辈_女'], playerConditions: {},
      options: [
        { text: '表姐真优秀，我也加油', type: 'compliant', faceChange: 5, moodChange: -8, reaction: '你要是也能进大厂就好了' },
        { text: '大厂也累啊，各有利弊', type: 'neutral', faceChange: 0, moodChange: 5, reaction: '累是累，但人家赚得多啊' },
        { text: '字节不也裁员了吗', type: 'rebellious', faceChange: -10, moodChange: 10, reaction: '你这孩子怎么净说丧气话' }
      ]},
    { id: 'q_compare_3', text: '人家孩子都上国际学校了，你看看你', tags: ['攀比', '热梗'], relativeTypes: ['长辈_女', '长辈_男'], playerConditions: {},
      options: [
        { text: '是啊，我得更努力才行', type: 'compliant', faceChange: 8, moodChange: -12, reaction: '知道就好，加油！' },
        { text: '国际学校也不一定好', type: 'neutral', faceChange: -3, moodChange: 5, reaction: '你这是吃不到葡萄说葡萄酸' },
        { text: '我上公立学校不也挺好的', type: 'rebellious', faceChange: -8, moodChange: 10, reaction: '时代不同了！' }
      ]},
    { id: 'q_compare_4', text: '你看隔壁家孩子，又升职了', tags: ['攀比'], relativeTypes: ['长辈_男', '长辈_女'], playerConditions: {},
      options: [
        { text: '人家确实优秀，值得学习', type: 'compliant', faceChange: 5, moodChange: -8, reaction: '你也得加把劲啊' },
        { text: '升职不代表一切', type: 'neutral', faceChange: 0, moodChange: 5, reaction: '年轻人不能没有上进心' },
        { text: '别人家的孩子永远是最好的', type: 'rebellious', faceChange: -10, moodChange: 12, reaction: '你这什么态度！' }
      ]},


    // === AI/科技梗类 ===
    { id: 'q_ai_1', text: '听说你搞AI的，帮我看看这个是不是诈骗', tags: ['社交热点', '热梗'], relativeTypes: ['长辈_女', '长辈_男'], playerConditions: {},
      options: [
        { text: '好的，我帮您看看', type: 'compliant', faceChange: 10, moodChange: -5, reaction: '还是你有文化，靠谱！' },
        { text: '我不是搞AI的...', type: 'neutral', faceChange: -3, moodChange: 3, reaction: '搞电脑的不都一样嘛' },
        { text: '这一看就是诈骗，别点', type: 'rebellious', faceChange: 5, moodChange: 5, reaction: '幸亏问了你，差点上当！' }
      ]},
    { id: 'q_ai_2', text: 'ChatGPT能帮我写作业吗？', tags: ['社交热点', '热梗'], relativeTypes: ['同辈_女', '同辈_男'], playerConditions: {},
      options: [
        { text: '可以辅助学习，但不能完全依赖', type: 'compliant', faceChange: 8, moodChange: -3, reaction: '那我试试，嘿嘿' },
        { text: '能，但老师一眼就能看出来', type: 'neutral', faceChange: 3, moodChange: 5, reaction: '那还是算了...' },
        { text: '你自己不学以后怎么办', type: 'rebellious', faceChange: -5, moodChange: 8, reaction: '你怎么跟我妈一个口气' }
      ]},
    { id: 'q_ai_3', text: '你们程序员是不是要被AI替代了？', tags: ['社交热点', '热梗'], relativeTypes: ['长辈_男', '同辈_男', '长辈_女'], playerConditions: { job: '互联网程序员' },
      options: [
        { text: 'AI是工具，会用AI的程序员更值钱', type: 'compliant', faceChange: 10, moodChange: -3, reaction: '说得有道理，那你工作稳了' },
        { text: '有可能，所以我在学新技术', type: 'neutral', faceChange: 5, moodChange: 0, reaction: '居安思危，不错' },
        { text: '先替代的是你们的工作', type: 'rebellious', faceChange: -12, moodChange: 15, reaction: '你这孩子说话真不好听！' }
      ]},
    { id: 'q_ai_4', text: '你玩那个DeepSeek吗？听说比ChatGPT还厉害', tags: ['社交热点', '热梗'], relativeTypes: ['同辈_男', '长辈_男'], playerConditions: {},
      options: [
        { text: '用过，确实不错，国产之光', type: 'compliant', faceChange: 8, moodChange: -3, reaction: '国产的就是好！' },
        { text: '各有优势，看使用场景', type: 'neutral', faceChange: 3, moodChange: 3, reaction: '你们搞技术的就是严谨' },
        { text: '都是炒概念，没那么神', type: 'rebellious', faceChange: -8, moodChange: 8, reaction: '你不懂，这是未来趋势！' }
      ]},
    { id: 'q_ai_5', text: '帮我手机清一下内存呗，太卡了', tags: ['社交热点'], relativeTypes: ['长辈_女', '长辈_男'], playerConditions: {},
      options: [
        { text: '好的，我帮您看看', type: 'compliant', faceChange: 8, moodChange: -8, reaction: '还是你有用，不像你表弟' },
        { text: '您下载太多APP了，删几个就好', type: 'neutral', faceChange: 3, moodChange: 0, reaction: '哪个能删？我都不敢删' },
        { text: '建议换个新手机', type: 'rebellious', faceChange: -5, moodChange: 5, reaction: '这手机才用两年！' }
      ]},

    // === 生活方式类 ===
    { id: 'q_life_1', text: '在外面吃得好不好？别老吃外卖', tags: ['传统寒暄'], relativeTypes: ['长辈_女'], playerConditions: {},
      options: [
        { text: '自己做饭呢，吃得挺健康', type: 'compliant', faceChange: 10, moodChange: -3, reaction: '会做饭好啊，以后好找对象' },
        { text: '偶尔吃外卖，大部分自己做', type: 'neutral', faceChange: 5, moodChange: 0, reaction: '外卖少吃，不健康' },
        { text: '天天外卖，方便', type: 'rebellious', faceChange: -8, moodChange: 5, reaction: '这怎么行！身体是革命的本钱！' }
      ]},
    { id: 'q_life_2', text: '有没有在健身？年轻人要注意身体', tags: ['传统寒暄'], relativeTypes: ['长辈_男', '同辈_男'], playerConditions: {},
      options: [
        { text: '有在跑步，保持锻炼', type: 'compliant', faceChange: 8, moodChange: -3, reaction: '好习惯，坚持下去！' },
        { text: '工作太忙，没时间', type: 'neutral', faceChange: 0, moodChange: 0, reaction: '再忙也要锻炼啊' },
        { text: '我的运动就是从床到沙发', type: 'rebellious', faceChange: -5, moodChange: 8, reaction: '哈哈哈，你这孩子' }
      ]},
    { id: 'q_life_3', text: '过年给爸妈买什么了？', tags: ['传统寒暄'], relativeTypes: ['长辈_女', '长辈_男'], playerConditions: {},
      options: [
        { text: '买了保健品和新衣服', type: 'compliant', faceChange: 12, moodChange: -3, reaction: '孝顺！你爸妈有福气' },
        { text: '发了个大红包', type: 'neutral', faceChange: 8, moodChange: 0, reaction: '实在，钱最实用' },
        { text: '人回来就是最好的礼物', type: 'rebellious', faceChange: -5, moodChange: 8, reaction: '光嘴甜有什么用...' }
      ]},
    { id: 'q_life_4', text: '谈恋爱了没？给你介绍一个？', tags: ['催婚催生'], relativeTypes: ['长辈_女'], playerConditions: { relationshipStatus: '单身' },
      options: [
        { text: '好啊，麻烦您了', type: 'compliant', faceChange: 10, moodChange: -10, reaction: '我同事家闺女/儿子可好了！' },
        { text: '暂时不考虑，先忙事业', type: 'neutral', faceChange: 0, moodChange: 5, reaction: '事业和感情不冲突啊' },
        { text: '不用了，我自己能找', type: 'rebellious', faceChange: -8, moodChange: 8, reaction: '你都找了这么久了...' }
      ]},

    { id: 'q_life_5', text: '你那个城市消费高不高？一个月花多少？', tags: ['生活方式'], relativeTypes: ['长辈_男', '长辈_女'], playerConditions: {},
      options: [
        { text: '还好，精打细算过日子', type: 'compliant', faceChange: 8, moodChange: -3, reaction: '会过日子的孩子好' },
        { text: '挺高的，房租就占一半', type: 'neutral', faceChange: 0, moodChange: 0, reaction: '大城市就是贵啊' },
        { text: '花多少赚多少，及时行乐', type: 'rebellious', faceChange: -10, moodChange: 10, reaction: '这可不行，得存钱！' }
      ]},
    { id: 'q_life_6', text: '什么时候回老家发展？大城市有什么好', tags: ['生活方式'], relativeTypes: ['长辈_男', '长辈_女'], playerConditions: {},
      options: [
        { text: '有在考虑，老家也不错', type: 'compliant', faceChange: 8, moodChange: -5, reaction: '回来好，离家近' },
        { text: '大城市机会多，再拼几年', type: 'neutral', faceChange: 3, moodChange: 3, reaction: '也是，年轻人要闯荡' },
        { text: '老家工资太低了', type: 'rebellious', faceChange: -8, moodChange: 8, reaction: '钱不是最重要的！' }
      ]},
    { id: 'q_life_7', text: '有没有买车？现在油价可贵了', tags: ['生活方式'], relativeTypes: ['长辈_男', '同辈_男'], playerConditions: {},
      options: [
        { text: '买了个新能源，省油', type: 'compliant', faceChange: 10, moodChange: -3, reaction: '新能源好，环保又省钱' },
        { text: '地铁方便，暂时不需要', type: 'neutral', faceChange: 0, moodChange: 3, reaction: '也是，大城市停车也贵' },
        { text: '买不起，骑共享单车', type: 'rebellious', faceChange: -8, moodChange: 5, reaction: '年轻人要有目标啊' }
      ]},

    // === 更多传统寒暄 ===
    { id: 'q_trad_1', text: '工作忙不忙？要注意身体啊', tags: ['传统寒暄'], relativeTypes: ['长辈_女', '长辈_男'], playerConditions: {},
      options: [
        { text: '还好，公司福利不错', type: 'compliant', faceChange: 8, moodChange: -3, reaction: '那就好，别太拼了' },
        { text: '挺忙的，经常加班', type: 'neutral', faceChange: 3, moodChange: -3, reaction: '年轻人拼一拼也好' },
        { text: '忙到没时间回家', type: 'rebellious', faceChange: -5, moodChange: 5, reaction: '再忙也要回家看看！' }
      ]},
    { id: 'q_trad_2', text: '过年准备待几天？', tags: ['传统寒暄'], relativeTypes: ['长辈_女', '长辈_男'], playerConditions: {},
      options: [
        { text: '待一周，好好陪陪家人', type: 'compliant', faceChange: 10, moodChange: -3, reaction: '好孩子，多陪陪爸妈' },
        { text: '就三天假，初三就走', type: 'neutral', faceChange: 0, moodChange: 3, reaction: '这么短？太忙了吧' },
        { text: '明天就走，还有工作', type: 'rebellious', faceChange: -10, moodChange: 8, reaction: '过年都不能好好待？' }
      ]},
    { id: 'q_trad_3', text: '今年挣了不少吧？给爸妈多少红包？', tags: ['传统寒暄', '职业收入'], relativeTypes: ['长辈_男'], playerConditions: {},
      options: [
        { text: '给了一万，孝敬爸妈', type: 'compliant', faceChange: 15, moodChange: -8, reaction: '好孩子！有出息！' },
        { text: '意思意思，心意到了', type: 'neutral', faceChange: 3, moodChange: 3, reaction: '心意到了就好' },
        { text: '我还找爸妈要红包呢', type: 'rebellious', faceChange: -10, moodChange: 10, reaction: '多大人了还要红包！' }
      ]},
    { id: 'q_trad_4', text: '你小时候我还抱过你呢，还记得不？', tags: ['传统寒暄'], relativeTypes: ['长辈_女', '长辈_男'], playerConditions: {},
      options: [
        { text: '记得记得，那时候您对我可好了', type: 'compliant', faceChange: 10, moodChange: -3, reaction: '哎呀，一转眼都长这么大了' },
        { text: '有点印象，太小了记不太清', type: 'neutral', faceChange: 3, moodChange: 0, reaction: '正常正常，那时候你才这么点大' },
        { text: '完全不记得了', type: 'rebellious', faceChange: -8, moodChange: 5, reaction: '这孩子...白疼你了' }
      ]},

    { id: 'q_trad_5', text: '在外面有没有交到好朋友？', tags: ['传统寒暄'], relativeTypes: ['长辈_女'], playerConditions: {},
      options: [
        { text: '有几个关系很好的同事朋友', type: 'compliant', faceChange: 8, moodChange: -3, reaction: '在外面要多交朋友，互相照应' },
        { text: '朋友不多，但都很铁', type: 'neutral', faceChange: 5, moodChange: 3, reaction: '朋友在精不在多' },
        { text: '社恐，不太爱社交', type: 'rebellious', faceChange: -5, moodChange: 8, reaction: '年轻人要多出去走走' }
      ]},
    { id: 'q_trad_6', text: '你爸说你在公司表现不错？', tags: ['传统寒暄', '职业收入'], relativeTypes: ['长辈_男'], playerConditions: {},
      options: [
        { text: '还行，领导挺认可的', type: 'compliant', faceChange: 12, moodChange: -5, reaction: '好好干，争取升职！' },
        { text: '一般般，混口饭吃', type: 'neutral', faceChange: 0, moodChange: 3, reaction: '谦虚了，你爸可骄傲了' },
        { text: '我爸在吹牛', type: 'rebellious', faceChange: -8, moodChange: 8, reaction: '哈哈，你爸确实爱吹' }
      ]},

    // === 更多社交热点 ===
    { id: 'q_hot_1', text: '你们年轻人是不是都不看电视了？', tags: ['社交热点'], relativeTypes: ['长辈_男', '长辈_女'], playerConditions: {},
      options: [
        { text: '偶尔看看，春晚还是要看的', type: 'compliant', faceChange: 8, moodChange: -3, reaction: '春晚是传统，要看！' },
        { text: '看手机多一些', type: 'neutral', faceChange: 0, moodChange: 3, reaction: '手机有什么好看的' },
        { text: '电视是什么？', type: 'rebellious', faceChange: -5, moodChange: 8, reaction: '你这孩子...' }
      ]},
    { id: 'q_hot_2', text: '你会不会用那个抖音？教教我', tags: ['社交热点'], relativeTypes: ['长辈_女', '长辈_男'], playerConditions: {},
      options: [
        { text: '会啊，我教您', type: 'compliant', faceChange: 10, moodChange: -5, reaction: '太好了，我想学拍视频' },
        { text: '会一点，不太常用', type: 'neutral', faceChange: 3, moodChange: 0, reaction: '年轻人不玩抖音？' },
        { text: '抖音太浪费时间了', type: 'rebellious', faceChange: -5, moodChange: 5, reaction: '我觉得挺有意思的啊' }
      ]},
    { id: 'q_hot_3', text: '现在的年轻人是不是都想躺平？', tags: ['社交热点', '职业收入'], relativeTypes: ['长辈_男'], playerConditions: {},
      options: [
        { text: '不会，我还是很上进的', type: 'compliant', faceChange: 10, moodChange: -5, reaction: '好，年轻人就要有冲劲' },
        { text: '偶尔想躺平，但还是得奋斗', type: 'neutral', faceChange: 3, moodChange: 3, reaction: '想想可以，别真躺' },
        { text: '躺平是一种生活态度', type: 'rebellious', faceChange: -12, moodChange: 12, reaction: '什么态度！不思进取！' }
      ]},
    { id: 'q_hot_4', text: '你们公司有没有搞那个元宇宙？', tags: ['社交热点'], relativeTypes: ['同辈_男', '长辈_男'], playerConditions: {},
      options: [
        { text: '没有，那个概念已经凉了', type: 'neutral', faceChange: 3, moodChange: 3, reaction: '啊？我还买了相关股票...' },
        { text: '有在研究，是未来方向', type: 'compliant', faceChange: 8, moodChange: -5, reaction: '那你们公司挺前沿的' },
        { text: '元宇宙就是骗局', type: 'rebellious', faceChange: -8, moodChange: 8, reaction: '你别乱说，我投了钱的！' }
      ]},
    { id: 'q_hot_5', text: '听说你们互联网人都财务自由了？', tags: ['社交热点', '职业收入'], relativeTypes: ['长辈_男', '长辈_女'], playerConditions: { job: '互联网程序员' },
      options: [
        { text: '哪有，都是少数人', type: 'neutral', faceChange: 3, moodChange: 3, reaction: '那你加油，争取成为少数人' },
        { text: '快了快了，再干几年', type: 'compliant', faceChange: 10, moodChange: -8, reaction: '好好干，我看好你！' },
        { text: '财务自由？我连财务自由的边都没摸到', type: 'rebellious', faceChange: -5, moodChange: 8, reaction: '哈哈，你这孩子挺实在' }
      ]},

    // === 更多催婚/生育/攀比补充 ===
    { id: 'q_marry_7', text: '你看你表姐，嫁得多好，老公又帅又有钱', tags: ['催婚催生', '攀比'], relativeTypes: ['长辈_女'], playerConditions: { relationshipStatus: '单身' },
      options: [
        { text: '表姐确实幸福，我也会找到的', type: 'compliant', faceChange: 5, moodChange: -8, reaction: '你得主动出击啊' },
        { text: '幸福不能只看表面', type: 'neutral', faceChange: 0, moodChange: 5, reaction: '你这话什么意思？' },
        { text: '我不需要靠嫁人/娶人来证明自己', type: 'rebellious', faceChange: -12, moodChange: 15, reaction: '你这想法太偏激了！' }
      ]},
    { id: 'q_compare_5', text: '你同学是不是都比你混得好？', tags: ['攀比'], relativeTypes: ['长辈_男'], playerConditions: {},
      options: [
        { text: '有比我好的，我在努力追赶', type: 'compliant', faceChange: 8, moodChange: -8, reaction: '有上进心就好' },
        { text: '各有各的活法', type: 'neutral', faceChange: 0, moodChange: 5, reaction: '你这是在安慰自己吧' },
        { text: '我不跟别人比', type: 'rebellious', faceChange: -8, moodChange: 10, reaction: '不比怎么进步？' }
      ]},
    { id: 'q_work_9', text: '你那个专业好找工作吗？', tags: ['职业收入'], relativeTypes: ['长辈_男', '长辈_女'], playerConditions: {},
      options: [
        { text: '还不错，就业率挺高的', type: 'compliant', faceChange: 8, moodChange: -3, reaction: '那就好，选对专业很重要' },
        { text: '一般般，得靠自己努力', type: 'neutral', faceChange: 3, moodChange: 0, reaction: '是这个理' },
        { text: '专业不重要，能力才重要', type: 'rebellious', faceChange: -5, moodChange: 8, reaction: '话是这么说...' }
      ]},
    { id: 'q_work_10', text: '有没有想过自己创业？', tags: ['职业收入'], relativeTypes: ['同辈_男', '长辈_男'], playerConditions: {},
      options: [
        { text: '有想法，在积累经验', type: 'compliant', faceChange: 10, moodChange: -5, reaction: '好，年轻人要有闯劲！' },
        { text: '创业风险太大，先稳着', type: 'neutral', faceChange: 3, moodChange: 3, reaction: '稳一点也好' },
        { text: '给别人打工挺好的，不操心', type: 'rebellious', faceChange: -8, moodChange: 8, reaction: '没出息！' }
      ]},
    { id: 'q_life_8', text: '你那个城市雾霾严重不？', tags: ['生活方式'], relativeTypes: ['长辈_女'], playerConditions: {},
      options: [
        { text: '还好，现在治理得不错了', type: 'compliant', faceChange: 5, moodChange: -3, reaction: '那就好，注意防护' },
        { text: '有时候挺严重的', type: 'neutral', faceChange: 0, moodChange: 0, reaction: '还是老家空气好' },
        { text: '习惯了，戴口罩就行', type: 'rebellious', faceChange: -3, moodChange: 5, reaction: '这怎么能习惯！' }
      ]},
    { id: 'q_life_9', text: '有没有在理财？基金股票买了没？', tags: ['生活方式'], relativeTypes: ['同辈_男', '长辈_男'], playerConditions: {},
      options: [
        { text: '买了点基金，稳健投资', type: 'compliant', faceChange: 8, moodChange: -3, reaction: '年轻人要学会理财' },
        { text: '没有，钱都不够花', type: 'neutral', faceChange: -3, moodChange: 3, reaction: '再少也要存一点' },
        { text: '全仓比特币，梭哈了', type: 'rebellious', faceChange: -10, moodChange: 12, reaction: '你疯了吧！那东西不靠谱！' }
      ]},
    { id: 'q_hot_6', text: '你觉得现在的年轻人为什么不想结婚？', tags: ['社交热点', '催婚催生'], relativeTypes: ['长辈_男', '长辈_女'], playerConditions: {},
      options: [
        { text: '可能是还没遇到对的人吧', type: 'compliant', faceChange: 8, moodChange: -5, reaction: '对的人要主动去找啊' },
        { text: '经济压力大，结婚成本高', type: 'neutral', faceChange: 3, moodChange: 3, reaction: '也是，现在彩礼都要几十万' },
        { text: '一个人也能过得很好', type: 'rebellious', faceChange: -10, moodChange: 10, reaction: '老了你就知道了！' }
      ]},
    { id: 'q_hot_7', text: '你们年轻人是不是都不想生孩子了？', tags: ['社交热点', '催婚催生'], relativeTypes: ['长辈_女'], playerConditions: {},
      options: [
        { text: '会生的，时机到了自然会', type: 'compliant', faceChange: 8, moodChange: -5, reaction: '别拖太久，年纪大了不好生' },
        { text: '养孩子责任太大了', type: 'neutral', faceChange: 0, moodChange: 5, reaction: '责任大但也有乐趣啊' },
        { text: '生孩子是为了什么？', type: 'rebellious', faceChange: -12, moodChange: 12, reaction: '为了传宗接代啊！' }
      ]},

    // === 补充问题 ===
    { id: 'q_extra_1', text: '你那个工作加班多不多？', tags: ['职业收入'], relativeTypes: ['长辈_女'], playerConditions: {},
      options: [
        { text: '还好，偶尔加班', type: 'compliant', faceChange: 5, moodChange: -3, reaction: '那还行，别太累了' },
        { text: '996是常态', type: 'neutral', faceChange: 0, moodChange: -5, reaction: '这也太辛苦了吧' },
        { text: '我从不加班，到点就走', type: 'rebellious', faceChange: -8, moodChange: 10, reaction: '这样能升职吗？' }
      ]},
    { id: 'q_extra_2', text: '你们公司上市了没？有没有股票？', tags: ['职业收入'], relativeTypes: ['长辈_男', '同辈_男'], playerConditions: {},
      options: [
        { text: '有期权，等上市就发了', type: 'compliant', faceChange: 12, moodChange: -5, reaction: '那可得好好干！' },
        { text: '小公司，没有股票', type: 'neutral', faceChange: -3, moodChange: 3, reaction: '那你考虑跳槽到大公司' },
        { text: '股票都是画饼', type: 'rebellious', faceChange: -5, moodChange: 8, reaction: '你这想法太消极了' }
      ]},
    { id: 'q_extra_3', text: '你那个城市房租多少？', tags: ['生活方式'], relativeTypes: ['长辈_男', '长辈_女'], playerConditions: {},
      options: [
        { text: '还能接受，合租分摊', type: 'compliant', faceChange: 5, moodChange: -3, reaction: '合租也挺好的' },
        { text: '一个月好几千', type: 'neutral', faceChange: 0, moodChange: 0, reaction: '大城市就是贵' },
        { text: '比老家一个月工资还多', type: 'rebellious', faceChange: -5, moodChange: 5, reaction: '那还不如回老家！' }
      ]},
    { id: 'q_extra_4', text: '你有没有在学什么新东西？', tags: ['传统寒暄'], relativeTypes: ['长辈_男', '同辈_女'], playerConditions: {},
      options: [
        { text: '在学理财和投资', type: 'compliant', faceChange: 8, moodChange: -3, reaction: '好，年轻人要有理财意识' },
        { text: '在学做饭', type: 'neutral', faceChange: 5, moodChange: 3, reaction: '实用！会做饭的人有福气' },
        { text: '在学怎么摸鱼', type: 'rebellious', faceChange: -8, moodChange: 10, reaction: '你这孩子...' }
      ]},
    { id: 'q_extra_5', text: '你觉得AI会不会取代所有工作？', tags: ['社交热点'], relativeTypes: ['同辈_男', '同辈_女'], playerConditions: {},
      options: [
        { text: '不会，人类有创造力', type: 'compliant', faceChange: 8, moodChange: -3, reaction: '说得对，人不可替代' },
        { text: '部分工作会被替代', type: 'neutral', faceChange: 3, moodChange: 3, reaction: '那我们得学新技能' },
        { text: '会，我们都要失业了', type: 'rebellious', faceChange: -5, moodChange: 8, reaction: '别吓我！' }
      ]},
    { id: 'q_extra_6', text: '你平时都玩什么游戏？', tags: ['社交热点'], relativeTypes: ['同辈_男', '同辈_女'], playerConditions: {},
      options: [
        { text: '偶尔玩玩，不沉迷', type: 'compliant', faceChange: 5, moodChange: -3, reaction: '适度娱乐挺好的' },
        { text: '王者荣耀，段位很高', type: 'neutral', faceChange: 0, moodChange: 5, reaction: '带我上分！' },
        { text: '我玩的游戏你们不懂', type: 'rebellious', faceChange: -5, moodChange: 8, reaction: '切，有什么了不起的' }
      ]},
    { id: 'q_extra_7', text: '你微信朋友圈怎么都不发了？', tags: ['社交热点'], relativeTypes: ['长辈_女'], playerConditions: {},
      options: [
        { text: '工作太忙，没时间发', type: 'compliant', faceChange: 5, moodChange: -3, reaction: '再忙也要分享生活啊' },
        { text: '设了分组，您看不到', type: 'neutral', faceChange: -3, moodChange: 5, reaction: '什么？你把我屏蔽了？' },
        { text: '朋友圈太假了，不想发', type: 'rebellious', faceChange: -8, moodChange: 8, reaction: '你这孩子想法真多' }
      ]},
    { id: 'q_extra_8', text: '你有没有在相亲平台注册？', tags: ['催婚催生'], relativeTypes: ['长辈_女'], playerConditions: { relationshipStatus: '单身' },
      options: [
        { text: '注册了，在看', type: 'compliant', faceChange: 8, moodChange: -8, reaction: '好，主动出击！' },
        { text: '不太信那些平台', type: 'neutral', faceChange: 0, moodChange: 3, reaction: '现在很多人都在上面找到的' },
        { text: '我不需要相亲', type: 'rebellious', faceChange: -10, moodChange: 10, reaction: '不相亲怎么认识人？' }
      ]},
  ],


  // ── 成就模板库（15+） ──
  achievements: [
    { id: 'ach_shine', name: '闪耀门楣', description: '面子值超过800', icon: '✨', conditionDesc: 'Face >= 800', condition: (s) => s.face >= 800 },
    { id: 'ach_sweep', name: '扫地出门', description: '面子丢光了', icon: '🧹', conditionDesc: 'Face < 100', condition: (s) => s.face < 100 },
    { id: 'ach_disown', name: '家谱除名', description: '心态彻底崩了', icon: '📕', conditionDesc: 'Mood < 50', condition: (s) => s.mood < 50 },
    { id: 'ach_drunk', name: '不省人事', description: '喝到断片', icon: '🍺', conditionDesc: 'Alcohol == 100', condition: (s) => s.alcohol >= 100 },
    { id: 'ach_smooth', name: '八面玲珑', description: '面子心态双丰收', icon: '🎭', conditionDesc: 'Face >= 600 且 Mood >= 600', condition: (s) => s.face >= 600 && s.mood >= 600 },
    { id: 'ach_sober', name: '滴酒不沾', description: '清醒社交达人', icon: '🧊', conditionDesc: 'Face >= 400 且 Mood >= 400 且 Alcohol < 30', condition: (s) => s.face >= 400 && s.mood >= 400 && s.alcohol < 30 },
    { id: 'ach_memory', name: '族谱活字典', description: '亲戚关系门清', icon: '📖', conditionDesc: '全部匹配正确', condition: (s, gs) => gs.seatingResult && gs.seatingResult.correctCount === 5 },
    { id: 'ach_social_king', name: '社交牛逼症', description: '社牛本牛', icon: '👑', conditionDesc: 'Face >= 700 且 Mood >= 700', condition: (s) => s.face >= 700 && s.mood >= 700 },
    { id: 'ach_yaoyao', name: '遥遥领先', description: '全部答对，精神状态遥遥领先', icon: '🚀', conditionDesc: 'Mood >= 900', condition: (s) => s.mood >= 900 },
    { id: 'ach_thanks', name: '我真的会谢', description: '心态崩溃到极致', icon: '😭', conditionDesc: 'Mood < 30', condition: (s) => s.mood < 30 },
    { id: 'ach_city', name: '城市套路深', description: '面子拉满的社交高手', icon: '🏙️', conditionDesc: 'Face >= 850', condition: (s) => s.face >= 850 },
    { id: 'ach_tangping', name: '躺平大师', description: '全选摆烂选项', icon: '🛋️', conditionDesc: '全程选择 rebellious', condition: (s, gs) => gs.dialogueState && gs.dialogueState.choicePattern.length > 0 && gs.dialogueState.choicePattern.every(c => c === 'rebellious') },
    { id: 'ach_juanwang', name: '卷王之王', description: '面子心态双高', icon: '💪', conditionDesc: 'Face >= 750 且 Mood >= 750', condition: (s) => s.face >= 750 && s.mood >= 750 },
    { id: 'ach_echai', name: '电子榨菜', description: '完成了一局游戏', icon: '📱', conditionDesc: '完成游戏', condition: () => true },
    { id: 'ach_iperson', name: 'i人之光', description: '全程最保守选项', icon: '🤫', conditionDesc: '全程选择 compliant', condition: (s, gs) => gs.dialogueState && gs.dialogueState.choicePattern.length > 0 && gs.dialogueState.choicePattern.every(c => c === 'compliant') },
    { id: 'ach_eperson', name: 'e人狂欢', description: '全程最大胆选项', icon: '🎉', conditionDesc: '全程选择 rebellious', condition: (s, gs) => gs.dialogueState && gs.dialogueState.choicePattern.length > 0 && gs.dialogueState.choicePattern.every(c => c === 'rebellious') },
    { id: 'ach_wine_god', name: '酒神附体', description: '游走在断片边缘', icon: '🍷', conditionDesc: 'Alcohol >= 80 且 Alcohol < 100', condition: (s) => s.alcohol >= 80 && s.alcohol < 100 },
    { id: 'ach_clear', name: '人间清醒', description: '不喝酒也能全场hold住', icon: '🧠', conditionDesc: 'Face >= 500 且 Mood >= 500 且 Alcohol == 0', condition: (s) => s.face >= 500 && s.mood >= 500 && s.alcohol === 0 },
    { id: 'ach_actor', name: '年度最佳演员', description: '面子很高但心态崩了', icon: '🎬', conditionDesc: 'Face >= 800 且 Mood < 200', condition: (s) => s.face >= 800 && s.mood < 200 }
  ]

};
