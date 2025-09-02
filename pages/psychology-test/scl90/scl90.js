Page({
  onShareAppMessage() {
    return {
      title: 'SCL90心理健康自评量表 - 星芒集盒',
      path: '/pages/psychology-test/scl90/scl90',
      imageUrl: '/images/logo.jpg'
    }
  },
  onShareTimeline() {
    return {
      title: 'SCL90心理健康自评量表 - 星芒集盒',
      path: '/pages/psychology-test/scl90/scl90',
      imageUrl: '/images/logo.jpg'
    }
  },
  data: {
    dimensions: [
      { name: "躯体化", id: "somatization" },
      { name: "强迫症状", id: "obsessive" },
      { name: "人际关系敏感", id: "interpersonal" },
      { name: "抑郁", id: "depression" },
      { name: "焦虑", id: "anxiety" },
      { name: "敌对", id: "hostility" },
      { name: "恐怖", id: "phobic" },
      { name: "偏执", id: "paranoid" },
      { name: "精神病性", id: "psychotic" },
      { name: "其他项目", id: "other" }
    ],
    questions: [
      { id: 1, text: "头痛", dimension: "somatization" },
      { id: 2, text: "神经过敏，心中不踏实", dimension: "anxiety" },
      { id: 3, text: "头脑中有不必要的想法或字句盘旋", dimension: "obsessive" },
      { id: 4, text: "头昏或昏倒", dimension: "somatization" },
      { id: 5, text: "对异性的兴趣减退", dimension: "other" },
      { id: 6, text: "对旁人责备求全", dimension: "hostility" },
      { id: 7, text: "感到别人能控制你的思想", dimension: "paranoid" },
      { id: 8, text: "责怪别人制造麻烦", dimension: "hostility" },
      { id: 9, text: "忘记性大", dimension: "other" },
      { id: 10, text: "担心自己的衣饰整齐及仪态的端正", dimension: "obsessive" },
      { id: 11, text: "容易烦恼和激动", dimension: "hostility" },
      { id: 12, text: "胸痛", dimension: "somatization" },
      { id: 13, text: "害怕空旷的场所或街道", dimension: "phobic" },
      { id: 14, text: "感到自己的精力下降，活动减慢", dimension: "depression" },
      { id: 15, text: "想结束自己的生命", dimension: "depression" },
      { id: 16, text: "听到旁人听不到的声音", dimension: "psychotic" },
      { id: 17, text: "发抖", dimension: "anxiety" },
      { id: 18, text: "感到大多数人都不可信任", dimension: "interpersonal" },
      { id: 19, text: "胃口不好", dimension: "somatization" },
      { id: 20, text: "容易哭泣", dimension: "depression" },
      { id: 21, text: "同异性相处时感到害羞不自在", dimension: "interpersonal" },
      { id: 22, text: "感到受骗，中了圈套或有人想抓您", dimension: "paranoid" },
      { id: 23, text: "无缘无故地突然感到害怕", dimension: "anxiety" },
      { id: 24, text: "自己不能控制地大发脾气", dimension: "hostility" },
      { id: 25, text: "怕单独出门", dimension: "phobic" },
      { id: 26, text: "经常责怪自己", dimension: "depression" },
      { id: 27, text: "腰痛", dimension: "somatization" },
      { id: 28, text: "感到难以完成任务", dimension: "obsessive" },
      { id: 29, text: "感到孤独", dimension: "depression" },
      { id: 30, text: "感到苦闷", dimension: "depression" },
      { id: 31, text: "过分担忧", dimension: "anxiety" },
      { id: 32, text: "对事物不感兴趣", dimension: "depression" },
      { id: 33, text: "感到害怕", dimension: "anxiety" },
      { id: 34, text: "我的感情容易受到伤害", dimension: "interpersonal" },
      { id: 35, text: "旁人能知道您的私下想法", dimension: "paranoid" },
      { id: 36, text: "感到别人不理解您不同情您", dimension: "interpersonal" },
      { id: 37, text: "感到人们对你不友好，不喜欢你", dimension: "interpersonal" },
      { id: 38, text: "做事必须做得很慢以保证做得正确", dimension: "obsessive" },
      { id: 39, text: "心跳得很厉害", dimension: "anxiety" },
      { id: 40, text: "恶心或胃部不舒服", dimension: "somatization" },
      { id: 41, text: "感到比不上他人", dimension: "depression" },
      { id: 42, text: "肌肉酸痛", dimension: "somatization" },
      { id: 43, text: "感到有人在监视您谈论您", dimension: "paranoid" },
      { id: 44, text: "难以入睡", dimension: "other" },
      { id: 45, text: "做事必须反复检查", dimension: "obsessive" },
      { id: 46, text: "难以作出决定", dimension: "obsessive" },
      { id: 47, text: "怕乘电车、公共汽车、地铁或火车", dimension: "phobic" },
      { id: 48, text: "呼吸有困难", dimension: "somatization" },
      { id: 49, text: "一阵阵发冷或发热", dimension: "somatization" },
      { id: 50, text: "因为感到害怕而避开某些东西，场合或活动", dimension: "phobic" },
      { id: 51, text: "脑子变空了", dimension: "obsessive" },
      { id: 52, text: "身体发麻或刺痛", dimension: "somatization" },
      { id: 53, text: "喉咙有梗塞感", dimension: "somatization" },
      { id: 54, text: "感到对前途没有希望", dimension: "other" },
      { id: 55, text: "不能集中注意力", dimension: "obsessive" },
      { id: 56, text: "感到身体的某一部分软弱无力", dimension: "somatization" },
      { id: 57, text: "感到紧张或容易紧张", dimension: "anxiety" },
      { id: 58, text: "感到手或脚发沉", dimension: "somatization" },
      { id: 59, text: "想到有关死亡的事", dimension: "other" },
      { id: 60, text: "吃得太多", dimension: "other" },
      { id: 61, text: "当别人看着您或谈论您时感到不自在", dimension: "interpersonal" },
      { id: 62, text: "有一些不属于您自己的想法", dimension: "psychotic" },
      { id: 63, text: "有想打人或伤害他人的冲动", dimension: "hostility" },
      { id: 64, text: "醒得太早", dimension: "other" },
      { id: 65, text: "必须反复洗手、点数目或触摸某些东西", dimension: "obsessive" },
      { id: 66, text: "睡得不稳不深", dimension: "other" },
      { id: 67, text: "有想摔坏或破坏东西的冲动", dimension: "hostility" },
      { id: 68, text: "有一些别人没有的想法或念头", dimension: "psychotic" },
      { id: 69, text: "感到对别人神经过敏", dimension: "interpersonal" },
      { id: 70, text: "在商店或电影院等人多的地方感到不自在", dimension: "phobic" },
      { id: 71, text: "感到任何事情都很难做", dimension: "obsessive" },
      { id: 72, text: "一阵阵恐惧或惊恐", dimension: "anxiety" },
      { id: 73, text: "感到在公共场合吃东西很不舒服", dimension: "interpersonal" },
      { id: 74, text: "经常与人争论", dimension: "hostility" },
      { id: 75, text: "单独一人时神经很紧张", dimension: "phobic" },
      { id: 76, text: "别人对您的成绩没有作出恰当的评价", dimension: "paranoid" },
      { id: 77, text: "即使和别人在一起也感到孤单", dimension: "interpersonal" },
      { id: 78, text: "感到坐立不安心神不宁", dimension: "anxiety" },
      { id: 79, text: "感到自己没有什么价值", dimension: "depression" },
      { id: 80, text: "感到熟悉的东西变成陌生或不象是真的", dimension: "psychotic" },
      { id: 81, text: "大叫或摔东西", dimension: "hostility" },
      { id: 82, text: "害怕会在公共场合昏倒", dimension: "phobic" },
      { id: 83, text: "感到别人想占您的便宜", dimension: "paranoid" },
      { id: 84, text: "为一些有关“性”的想法而很苦恼", dimension: "psychotic" },
      { id: 85, text: "认为应该因为自己的过错而受到惩罚", dimension: "other" },
      { id: 86, text: "感到要赶快把事情做完", dimension: "obsessive" },
      { id: 87, text: "感到自己的身体有严重问题", dimension: "somatization" },
      { id: 88, text: "从未感到和其他人很亲近", dimension: "interpersonal" },
      { id: 89, text: "感到自己有罪", dimension: "other" },
      { id: 90, text: "感到自己的脑子有毛病", dimension: "psychotic" }
    ],
    // 为所有题目统一添加选项
    options: [
      { text: "没有", score: 1 },
      { text: "很轻", score: 2 },
      { text: "中等", score: 3 },
      { text: "偏重", score: 4 },
      { text: "严重", score: 5 }
    ],
    currentQuestion: 0,
    answers: {}, // 使用对象存储，键为questionId，值为分数
    result: null,
    totalScore: 0,
    positiveSymptomCount: 0, // 阳性项目数 (得分 > 1 的项目数)
    positiveSymptomTotal: 0, // 阳性症状总分 (得分 > 1 的项目分数之和)
    positiveSymptomDistressLevel: 0, // 阳性症状均分
    totalSymptomIndex: 0, // 总症状指数 (总分/90)
    dimensionScores: {}, // 各维度得分对象
    dimensionDescriptions: {} // 各维度描述对象
  },

  selectOption: function (e) {
    const { index } = e.currentTarget.dataset;
    const { questions, currentQuestion, answers, options } = this.data;
    const currentQuestionId = questions[currentQuestion].id;
    const selectedScore = options[index].score;

    // 更新答案对象
    this.setData({
      [`answers.${currentQuestionId}`]: selectedScore
    });

    if (currentQuestion < questions.length - 1) {
      this.setData({ currentQuestion: currentQuestion + 1 });
    } else {
      this.calculateResult();
    }
  },

  // 添加上一题功能
  prevQuestion: function () {
    if (this.data.currentQuestion > 0) {
      this.setData({
        currentQuestion: this.data.currentQuestion - 1
      });
    }
  },

  calculateResult: function () {
    const { answers, dimensions, questions } = this.data;
    let totalScore = 0;
    let positiveSymptomCount = 0;
    let positiveSymptomTotal = 0;
    const dimensionScores = {};
    const dimensionDescriptions = {};

    questions.forEach(q => {
      const score = answers[q.id] !== undefined ? answers[q.id] : 1; // 未答题计为最低分1
      totalScore += score;
      if (score > 1) {
        positiveSymptomCount++;
        positiveSymptomTotal += score;
      }
    });

    dimensions.forEach(dim => {
      const dimQuestions = questions.filter(q => q.dimension === dim.id);
      let dimTotal = 0;
      dimQuestions.forEach(q => {
        dimTotal += answers[q.id] !== undefined ? answers[q.id] : 1;
      });
      const dimScore = dimTotal / dimQuestions.length;
      dimensionScores[dim.id] = parseFloat(dimScore.toFixed(2));

      // 各维度结果描述
      if (dimScore <= 1) {
        dimensionDescriptions[dim.id] = `${dim.name}维度得分非常低，表明在此方面几乎没有症状。`;
      } else if (dimScore <= 1.5) {
         dimensionDescriptions[dim.id] = `${dim.name}维度得分较低，表明在此方面症状不明显。`;
      } else if (dimScore <= 2.5) {
        dimensionDescriptions[dim.id] = `${dim.name}维度得分轻度升高，可能提示存在轻微症状。`;
      } else if (dimScore <= 3.5) {
        dimensionDescriptions[dim.id] = `${dim.name}维度得分中度升高，表明在此方面可能存在较明显的症状。`;
      } else if (dimScore <= 4.5) {
        dimensionDescriptions[dim.id] = `${dim.name}维度得分较高，表明在此方面可能存在严重的症状。`;
      } else {
         dimensionDescriptions[dim.id] = `${dim.name}维度得分非常高，表明在此方面存在非常严重的症状。`;
      }
    });

    const positiveSymptomDistressLevel = positiveSymptomCount > 0 ? positiveSymptomTotal / positiveSymptomCount : 0;
    const totalSymptomIndex = totalScore / 90;

    // 总体结果描述
    let overallDescription = "";
    if (totalSymptomIndex <= 1) {
      overallDescription = "您的SCL-90测试结果显示，总体心理健康状况非常好，各项指标均在正常范围内。这是一个积极的信号，表明您当前的情绪状态和心理功能非常稳定。请继续保持健康的生活方式和积极的心态。";
    } else if (totalSymptomIndex <= 1.5) {
       overallDescription = "您的SCL-90测试结果显示，总体心理健康状况良好，各项指标均在正常范围内。这是一个积极的信号，表明您当前的情绪状态和心理功能相对稳定。请继续保持健康的生活方式和积极的心态。如果您有任何担忧，或情绪出现变化，也可以与信任的人交流或寻求专业建议。";
    } else if (totalSymptomIndex <= 2.5) {
      overallDescription = "您的测试结果显示存在轻度的心理症状。您可能偶尔感到一些心理上的不适，如焦虑、抑郁或人际关系敏感等，但这些症状对日常生活的影响相对较小。建议您关注自己的情绪变化，尝试一些自我调节的方法，如规律作息、适度运动、培养兴趣爱好、与亲友沟通等。如果症状持续或加重，请考虑寻求专业心理咨询师的帮助。";
    } else if (totalSymptomIndex <= 3.5) {
      overallDescription = "您的测试结果显示存在中度的心理症状。您可能经常感到心理上的困扰，并伴有明显的身体或情绪反应，这些症状已经开始对您的工作、学习或人际关系产生一定影响。强烈建议您重视自己的心理状态，积极寻求专业心理咨询师或精神科医生的帮助，以便获得更有效的评估和干预。";
    } else {
      overallDescription = "您的测试结果显示存在较严重的心理症状。您可能经历着非常痛苦的心理体验，这很可能严重影响您的日常生活和社会功能。请务必尽快联系专业心理医生或精神科医生进行诊断和治疗。如果您感到极度痛苦或有自伤、伤人念头，请立即联系信任的人或拨打心理危机干预热线寻求紧急帮助。";
    }

    this.setData({
      result: {
        overallDescription: overallDescription
      },
      totalScore: parseFloat(totalScore.toFixed(2)),
      positiveSymptomCount: positiveSymptomCount,
      positiveSymptomTotal: parseFloat(positiveSymptomTotal.toFixed(2)),
      positiveSymptomDistressLevel: parseFloat(positiveSymptomDistressLevel.toFixed(2)),
      totalSymptomIndex: parseFloat(totalSymptomIndex.toFixed(2)),
      dimensionScores: dimensionScores,
      dimensionDescriptions: dimensionDescriptions
    });
  },

  restartTest: function () {
    this.setData({
      currentQuestion: 0,
      answers: {},
      result: null,
      totalScore: 0,
      positiveSymptomCount: 0,
      positiveSymptomTotal: 0,
      positiveSymptomDistressLevel: 0,
      totalSymptomIndex: 0,
      dimensionScores: {},
      dimensionDescriptions: {}
    });
  }
});




