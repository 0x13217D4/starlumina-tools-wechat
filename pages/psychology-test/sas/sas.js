Page({
  onShareAppMessage() {
    return {
      title: 'SAS焦虑自评量表 - 星芒集盒',
      path: '/pages/psychology-test/sas/sas',
      imageUrl: '/images/logo.jpg'
    }
  },
  onShareTimeline() {
    return {
      title: 'SAS焦虑自评量表 - 星芒集盒',
      path: '/pages/psychology-test/sas/sas',
      imageUrl: '/images/logo.jpg'
    }
  },
  data: {
    questions: [
      {
        id: 1,
        text: "我觉得比平常容易紧张和着急",
        options: [
          { text: "没有或很少时间", score: 1 },
          { text: "小部分时间", score: 2 },
          { text: "相当多时间", score: 3 },
          { text: "绝大部分或全部时间", score: 4 }
        ]
      },
      {
        id: 2,
        text: "我无缘无故地感到害怕",
        options: [
          { text: "没有或很少时间", score: 1 },
          { text: "小部分时间", score: 2 },
          { text: "相当多时间", score: 3 },
          { text: "绝大部分或全部时间", score: 4 }
        ]
      },
      {
        id: 3,
        text: "我容易心里烦乱或感到惊恐",
        options: [
          { text: "没有或很少时间", score: 1 },
          { text: "小部分时间", score: 2 },
          { text: "相当多时间", score: 3 },
          { text: "绝大部分或全部时间", score: 4 }
        ]
      },
      {
        id: 4,
        text: "我觉得我可能快要发疯了",
        options: [
          { text: "没有或很少时间", score: 1 },
          { text: "小部分时间", score: 2 },
          { text: "相当多时间", score: 3 },
          { text: "绝大部分或全部时间", score: 4 }
        ]
      },
      {
        id: 5,
        text: "我觉得一切都很好,也不会发生什么不幸",
        // 注意：这是反向计分题
        options: [
          { text: "绝大部分或全部时间", score: 1 }, // 原4分 -> 1分
          { text: "相当多时间", score: 2 },         // 原3分 -> 2分
          { text: "小部分时间", score: 3 },         // 原2分 -> 3分
          { text: "没有或很少时间", score: 4 }      // 原1分 -> 4分
        ]
      },
      {
        id: 6,
        text: "我手脚发抖打颤",
        options: [
          { text: "没有或很少时间", score: 1 },
          { text: "小部分时间", score: 2 },
          { text: "相当多时间", score: 3 },
          { text: "绝大部分或全部时间", score: 4 }
        ]
      },
      {
        id: 7,
        text: "我因为头痛、颈痛和背痛而苦恼",
        options: [
          { text: "没有或很少时间", score: 1 },
          { text: "小部分时间", score: 2 },
          { text: "相当多时间", score: 3 },
          { text: "绝大部分或全部时间", score: 4 }
        ]
      },
      {
        id: 8,
        text: "我感觉容易衰弱和疲乏",
        options: [
          { text: "没有或很少时间", score: 1 },
          { text: "小部分时间", score: 2 },
          { text: "相当多时间", score: 3 },
          { text: "绝大部分或全部时间", score: 4 }
        ]
      },
      {
        id: 9,
        text: "我觉得心平气和,并且容易安静坐着",
        // 注意：这是反向计分题
        options: [
          { text: "绝大部分或全部时间", score: 1 }, // 原4分 -> 1分
          { text: "相当多时间", score: 2 },         // 原3分 -> 2分
          { text: "小部分时间", score: 3 },         // 原2分 -> 3分
          { text: "没有或很少时间", score: 4 }      // 原1分 -> 4分
        ]
      },
      {
        id: 10,
        text: "我觉得心跳得很快",
        options: [
          { text: "没有或很少时间", score: 1 },
          { text: "小部分时间", score: 2 },
          { text: "相当多时间", score: 3 },
          { text: "绝大部分或全部时间", score: 4 }
        ]
      },
      {
        id: 11,
        text: "我因为一阵阵头晕而苦恼",
        options: [
          { text: "没有或很少时间", score: 1 },
          { text: "小部分时间", score: 2 },
          { text: "相当多时间", score: 3 },
          { text: "绝大部分或全部时间", score: 4 }
        ]
      },
      {
        id: 12,
        text: "我有晕倒发作,或觉得要晕倒似的",
        options: [
          { text: "没有或很少时间", score: 1 },
          { text: "小部分时间", score: 2 },
          { text: "相当多时间", score: 3 },
          { text: "绝大部分或全部时间", score: 4 }
        ]
      },
      {
        id: 13,
        text: "我吸气呼气都感到很容易",
        // 注意：这是反向计分题
        options: [
          { text: "绝大部分或全部时间", score: 1 }, // 原4分 -> 1分
          { text: "相当多时间", score: 2 },         // 原3分 -> 2分
          { text: "小部分时间", score: 3 },         // 原2分 -> 3分
          { text: "没有或很少时间", score: 4 }      // 原1分 -> 4分
        ]
      },
      {
        id: 14,
        text: "我的手脚麻木和刺痛",
        options: [
          { text: "没有或很少时间", score: 1 },
          { text: "小部分时间", score: 2 },
          { text: "相当多时间", score: 3 },
          { text: "绝大部分或全部时间", score: 4 }
        ]
      },
      {
        id: 15,
        text: "我因为胃痛和消化不良而苦恼",
        options: [
          { text: "没有或很少时间", score: 1 },
          { text: "小部分时间", score: 2 },
          { text: "相当多时间", score: 3 },
          { text: "绝大部分或全部时间", score: 4 }
        ]
      },
      {
        id: 16,
        text: "我常常要小便",
        options: [
          { text: "没有或很少时间", score: 1 },
          { text: "小部分时间", score: 2 },
          { text: "相当多时间", score: 3 },
          { text: "绝大部分或全部时间", score: 4 }
        ]
      },
      {
        id: 17,
        text: "我的手常常是干燥温暖的",
        // 注意：这是反向计分题
        options: [
          { text: "绝大部分或全部时间", score: 1 }, // 原4分 -> 1分
          { text: "相当多时间", score: 2 },         // 原3分 -> 2分
          { text: "小部分时间", score: 3 },         // 原2分 -> 3分
          { text: "没有或很少时间", score: 4 }      // 原1分 -> 4分
        ]
      },
      {
        id: 18,
        text: "我脸红发热",
        options: [
          { text: "没有或很少时间", score: 1 },
          { text: "小部分时间", score: 2 },
          { text: "相当多时间", score: 3 },
          { text: "绝大部分或全部时间", score: 4 }
        ]
      },
      {
        id: 19,
        text: "我容易入睡并且一夜睡得很好",
        // 注意：这是反向计分题
        options: [
          { text: "绝大部分或全部时间", score: 1 }, // 原4分 -> 1分
          { text: "相当多时间", score: 2 },         // 原3分 -> 2分
          { text: "小部分时间", score: 3 },         // 原2分 -> 3分
          { text: "没有或很少时间", score: 4 }      // 原1分 -> 4分
        ]
      },
      {
        id: 20,
        text: "我作恶梦",
        options: [
          { text: "没有或很少时间", score: 1 },
          { text: "小部分时间", score: 2 },
          { text: "相当多时间", score: 3 },
          { text: "绝大部分或全部时间", score: 4 }
        ]
      }
    ],
    currentQuestion: 0,
    answers: [],
    result: null,
    totalScore: 0,
    standardScore: 0
  },

  selectOption: function (e) {
    const { index } = e.currentTarget.dataset;
    const { questions, currentQuestion, answers } = this.data;
    const selectedScore = questions[currentQuestion].options[index].score;

    // 更新答案，支持重新选择
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedScore;

    this.setData({ answers: newAnswers });

    if (currentQuestion < questions.length - 1) {
      this.setData({ currentQuestion: currentQuestion + 1 });
    } else {
      this.calculateResult();
    }
  },

  // 添加上一题功能 (需要在WXML中添加对应按钮)
  prevQuestion: function () {
    if (this.data.currentQuestion > 0) {
      this.setData({
        currentQuestion: this.data.currentQuestion - 1
      });
    }
  },

  calculateResult: function () {
    const rawScore = this.data.answers.reduce((sum, score) => {
      // 处理未作答的情况，计为最低分1分
      return sum + (typeof score === 'number' ? score : 1);
    }, 0);

    // 计算标准分 (粗分 * 1.25 后取整数部分)
    const standardScore = Math.floor(rawScore * 1.25);

    let result = {};

    if (standardScore >= 0 && standardScore < 50) {
      result = {
        level: "正常范围",
        description: "您的测试结果显示焦虑水平在正常范围内。这是一个积极的信号，表明您当前的情绪状态相对良好。请继续保持健康的生活方式和积极的心态。如果您有任何担忧，或情绪出现变化，也可以与信任的人交流或寻求专业建议。",
        suggestion: "保持现状，关注积极面。"
      };
    } else if (standardScore >= 50 && standardScore < 60) {
      result = {
        level: "轻度焦虑",
        description: "您的测试结果显示存在轻度焦虑症状。您可能偶尔感到紧张、担心或不安，但这些症状对日常生活的影响相对较小。建议您关注自己的情绪变化，尝试一些自我调节的方法，如规律作息、适度运动、深呼吸练习、正念冥想、培养兴趣爱好、与亲友沟通等。如果症状持续或加重，请考虑寻求专业心理咨询师的帮助。",
        suggestion: "自我调节，必要时寻求专业帮助。"
      };
    } else if (standardScore >= 60 && standardScore < 70) {
      result = {
        level: "中度焦虑",
        description: "您的测试结果显示存在中度焦虑症状。您可能经常感到紧张、担心、恐惧，并伴有明显的身体不适（如心慌、出汗、头晕等），这些症状已经开始对您的工作、学习或人际关系产生一定影响。强烈建议您重视自己的情绪状态，积极寻求专业心理咨询师或精神科医生的帮助，以便获得更有效的评估和干预。",
        suggestion: "寻求专业心理咨询或治疗。"
      };
    } else if (standardScore >= 70) {
      result = {
        level: "重度焦虑",
        description: "您的测试结果显示存在重度焦虑症状。您可能经历着非常痛苦的焦虑情绪体验，并伴有严重的躯体症状，这很可能严重影响您的日常生活和社会功能。请务必尽快联系专业心理医生或精神科医生进行诊断和治疗。如果您感到极度痛苦或有自伤念头，请立即联系信任的人或拨打心理危机干预热线寻求紧急帮助。",
        suggestion: "立即寻求专业医疗帮助。"
      };
    } else {
      // 理论上不会到达这里
      result = {
        level: "结果异常",
        description: "评分计算出现异常，请重新测试或联系专业人员。",
        suggestion: "重新测试或咨询技术人员。"
      };
    }

    this.setData({
      result,
      totalScore: rawScore, // 保存粗分
      standardScore: standardScore // 保存标准分
    });
  },

  restartTest: function () {
    this.setData({
      currentQuestion: 0,
      answers: [],
      result: null,
      totalScore: 0,
      standardScore: 0
    });
  }
});




