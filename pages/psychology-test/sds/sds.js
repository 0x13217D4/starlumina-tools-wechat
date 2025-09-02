Page({
  onShareAppMessage() {
    return {
      title: 'SDS抑郁自评量表 - 星芒集盒',
      path: '/pages/psychology-test/sds/sds',
      imageUrl: '/images/logo.jpg'
    }
  },
  onShareTimeline() {
    return {
      title: 'SDS抑郁自评量表 - 星芒集盒',
      path: '/pages/psychology-test/sds/sds',
      imageUrl: '/images/logo.jpg'
    }
  },
  data: {
    questions: [
      {
        id: 1,
        text: "我觉得闷闷不乐，情绪低沉",
        options: [
          { text: "没有或很少时间", score: 1 },
          { text: "小部分时间", score: 2 },
          { text: "相当多时间", score: 3 },
          { text: "绝大部分或全部时间", score: 4 }
        ]
      },
      {
        id: 2,
        text: "我觉得一天之中早晨最好",
        options: [
          { text: "没有或很少时间", score: 4 }, // 反向计分
          { text: "小部分时间", score: 3 },
          { text: "相当多时间", score: 2 },
          { text: "绝大部分或全部时间", score: 1 }
        ]
      },
      {
        id: 3,
        text: "我一阵阵哭出来或是想哭",
        options: [
          { text: "没有或很少时间", score: 1 },
          { text: "小部分时间", score: 2 },
          { text: "相当多时间", score: 3 },
          { text: "绝大部分或全部时间", score: 4 }
        ]
      },
      {
        id: 4,
        text: "我晚上睡眠不好",
        options: [
          { text: "没有或很少时间", score: 1 },
          { text: "小部分时间", score: 2 },
          { text: "相当多时间", score: 3 },
          { text: "绝大部分或全部时间", score: 4 }
        ]
      },
      {
        id: 5,
        text: "我吃的和平时一样多",
        options: [
          { text: "没有或很少时间", score: 4 }, // 反向计分
          { text: "小部分时间", score: 3 },
          { text: "相当多时间", score: 2 },
          { text: "绝大部分或全部时间", score: 1 }
        ]
      },
      {
        id: 6,
        text: "我与异性接触时和以往一样感到愉快",
        options: [
          { text: "没有或很少时间", score: 4 }, // 反向计分
          { text: "小部分时间", score: 3 },
          { text: "相当多时间", score: 2 },
          { text: "绝大部分或全部时间", score: 1 }
        ]
      },
      {
        id: 7,
        text: "我发觉我的体重在下降",
        options: [
          { text: "没有或很少时间", score: 1 },
          { text: "小部分时间", score: 2 },
          { text: "相当多时间", score: 3 },
          { text: "绝大部分或全部时间", score: 4 }
        ]
      },
      {
        id: 8,
        text: "我有便秘的苦恼",
        options: [
          { text: "没有或很少时间", score: 1 },
          { text: "小部分时间", score: 2 },
          { text: "相当多时间", score: 3 },
          { text: "绝大部分或全部时间", score: 4 }
        ]
      },
      {
        id: 9,
        text: "我心跳比平时快",
        options: [
          { text: "没有或很少时间", score: 1 },
          { text: "小部分时间", score: 2 },
          { text: "相当多时间", score: 3 },
          { text: "绝大部分或全部时间", score: 4 }
        ]
      },
      {
        id: 10,
        text: "我无缘无故地感到疲乏",
        options: [
          { text: "没有或很少时间", score: 1 },
          { text: "小部分时间", score: 2 },
          { text: "相当多时间", score: 3 },
          { text: "绝大部分或全部时间", score: 4 }
        ]
      },
      {
        id: 11,
        text: "我的头脑和平时一样清楚",
        options: [
          { text: "没有或很少时间", score: 4 }, // 反向计分
          { text: "小部分时间", score: 3 },
          { text: "相当多时间", score: 2 },
          { text: "绝大部分或全部时间", score: 1 }
        ]
      },
      {
        id: 12,
        text: "我觉得经常做的事情并没有困难",
        options: [
          { text: "没有或很少时间", score: 4 }, // 反向计分
          { text: "小部分时间", score: 3 },
          { text: "相当多时间", score: 2 },
          { text: "绝大部分或全部时间", score: 1 }
        ]
      },
      {
        id: 13,
        text: "我觉得不安而平静不下来",
        options: [
          { text: "没有或很少时间", score: 1 },
          { text: "小部分时间", score: 2 },
          { text: "相当多时间", score: 3 },
          { text: "绝大部分或全部时间", score: 4 }
        ]
      },
      {
        id: 14,
        text: "我对将来抱有希望",
        options: [
          { text: "没有或很少时间", score: 4 }, // 反向计分
          { text: "小部分时间", score: 3 },
          { text: "相当多时间", score: 2 },
          { text: "绝大部分或全部时间", score: 1 }
        ]
      },
      {
        id: 15,
        text: "我比平时更容易激动",
        options: [
          { text: "没有或很少时间", score: 1 },
          { text: "小部分时间", score: 2 },
          { text: "相当多时间", score: 3 },
          { text: "绝大部分或全部时间", score: 4 }
        ]
      },
      {
        id: 16,
        text: "我觉得作出决定是容易的",
        options: [
          { text: "没有或很少时间", score: 4 }, // 反向计分
          { text: "小部分时间", score: 3 },
          { text: "相当多时间", score: 2 },
          { text: "绝大部分或全部时间", score: 1 }
        ]
      },
      {
        id: 17,
        text: "我觉得自己是个有用的人，有人需要我",
        options: [
          { text: "没有或很少时间", score: 4 }, // 反向计分
          { text: "小部分时间", score: 3 },
          { text: "相当多时间", score: 2 },
          { text: "绝大部分或全部时间", score: 1 }
        ]
      },
      {
        id: 18,
        text: "我的生活过得很有意义",
        options: [
          { text: "没有或很少时间", score: 4 }, // 反向计分
          { text: "小部分时间", score: 3 },
          { text: "相当多时间", score: 2 },
          { text: "绝大部分或全部时间", score: 1 }
        ]
      },
      {
        id: 19,
        text: "我认为如果我死了别人会生活得好些",
        options: [
          { text: "没有或很少时间", score: 4 }, // 反向计分
          { text: "小部分时间", score: 3 },
          { text: "相当多时间", score: 2 },
          { text: "绝大部分或全部时间", score: 1 }
        ]
      },
      {
        id: 20,
        text: "平常感兴趣的事我仍然照样感兴趣",
        options: [
          { text: "没有或很少时间", score: 4 }, // 反向计分
          { text: "小部分时间", score: 3 },
          { text: "相当多时间", score: 2 },
          { text: "绝大部分或全部时间", score: 1 }
        ]
      }
    ],
    currentQuestion: 0,
    answers: {}, // 使用对象存储答案，键为questionId
    result: null
  },

  selectOption: function (e) {
    const { index } = e.currentTarget.dataset;
    const { questions, currentQuestion, answers } = this.data;
    const currentQuestionId = questions[currentQuestion].id;
    const selectedScore = questions[currentQuestion].options[index].score;

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
    const { questions, answers } = this.data;

    // 计算原始分 (Raw Score)
    let rawScore = 0;
    questions.forEach(q => {
      const score = answers[q.id] !== undefined ? answers[q.id] : 1; // 未答题计为最低分1
      rawScore += score;
    });

    // 计算标准分 (Standard Score) = 原始分 * 1.25 后取整数部分
    const standardScore = Math.floor(rawScore * 1.25);

    let result = {};

    if (standardScore < 53) {
      result = {
        level: "正常范围",
        description: "您的抑郁水平在正常范围内。这是一个积极的信号，表明您当前的情绪状态稳定。请继续保持健康的生活方式和积极的心态。"
      };
    } else if (standardScore >= 53 && standardScore <= 62) {
      result = {
        level: "轻度抑郁",
        description: "您的测试结果显示存在轻度的抑郁情绪。您可能偶尔感到情绪低落、缺乏兴趣或精力不足，但这些感受尚在可控制范围内，对日常生活的影响相对较小。建议您关注自己的情绪变化，尝试一些自我调节的方法，如规律作息、适度运动、培养兴趣爱好、与亲友沟通等。如果症状持续或加重，请考虑寻求专业心理咨询师的帮助。"
      };
    } else if (standardScore >= 63 && standardScore <= 72) {
      result = {
        level: "中度抑郁",
        description: "您的测试结果显示存在中度的抑郁症状。您可能经常感到情绪沮丧、对未来失去希望、自我评价低，并伴有明显的身体不适（如睡眠、食欲问题），这些症状已经开始对您的工作、学习或人际关系产生一定影响。强烈建议您重视自己的心理状态，积极寻求专业心理咨询师或精神科医生的帮助，以便获得更有效的评估和干预。"
      };
    } else { // standardScore >= 73
      result = {
        level: "重度抑郁",
        description: "您的测试结果显示存在严重的抑郁症状。您可能经历着非常痛苦的情绪体验，如持续的悲伤、绝望感、强烈的无助感，甚至可能伴有自伤或自杀的念头，这很可能严重影响您的日常生活和社会功能。请务必尽快联系专业心理医生或精神科医生进行诊断和治疗。如果您感到极度痛苦或有自伤、伤人念头，请立即联系信任的人或拨打心理危机干预热线寻求紧急帮助。"
      };
    }

    this.setData({
      result: {
        rawScore: rawScore,
        standardScore: standardScore,
        ...result
      }
    });
  },

  restartTest: function () {
    this.setData({
      currentQuestion: 0,
      answers: {},
      result: null
    });
  }
});




