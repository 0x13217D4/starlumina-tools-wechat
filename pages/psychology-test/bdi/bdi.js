Page({
  onShareAppMessage() {
    return {
      title: 'BDI抑郁自评问卷 - 星芒集盒',
      path: '/pages/psychology-test/bdi/bdi',
      imageUrl: '/images/logo.jpg'
    }
  },
  onShareTimeline() {
    return {
      title: 'BDI抑郁自评问卷 - 星芒集盒',
      path: '/pages/psychology-test/bdi/bdi',
      imageUrl: '/images/logo.jpg'
    }
  },
  data: {
    questions: [
      {
        id: 1,
        text: "悲伤",
        options: [
          { text: "我不感到悲伤", score: 0 },
          { text: "我感到悲伤", score: 1 },
          { text: "我整天感到悲伤，不能摆脱", score: 2 },
          { text: "我太悲伤或不愉快，我不能忍受", score: 3 }
        ]
      },
      {
        id: 2,
        text: "悲观",
        options: [
          { text: "我对未来不感到悲观", score: 0 },
          { text: "我对未来感到悲观", score: 1 },
          { text: "我感到没有什么可期待的", score: 2 },
          { text: "我感到未来无望，事情不能改善", score: 3 }
        ]
      },
      {
        id: 3,
        text: "失败感",
        options: [
          { text: "我没有失败感", score: 0 },
          { text: "我感到我失败了", score: 1 },
          { text: "当我回顾我最近所做的事，或看我目前的状况，我感到很多失败", score: 2 },
          { text: "我觉得我完全失败了，是个彻底的失败者", score: 3 }
        ]
      },
      {
        id: 4,
        text: "缺乏满足感",
        options: [
          { text: "我能像平常一样从我所做的事中得到满足感", score: 0 },
          { text: "我从我所做的事中得到的满足感比以前少", score: 1 },
          { text: "从我所做的事中，我很少得到满足感", score: 2 },
          { text: "我不能从我所做的事中得到满足感", score: 3 }
        ]
      },
      {
        id: 5,
        text: "内疚感",
        options: [
          { text: "我对自己并不感到特别内疚", score: 0 },
          { text: "我对自己感到内疚", score: 1 },
          { text: "我为自己做过或没有做过的事感到内疚", score: 2 },
          { text: "我觉得我很坏，或对什么事都感到内疚", score: 3 }
        ]
      },
      {
        id: 6,
        text: "惩罚感",
        options: [
          { text: "我没有觉得自己受到惩罚", score: 0 },
          { text: "我觉得我可能会受到惩罚", score: 1 },
          { text: "我期待受到惩罚", score: 2 },
          { text: "我觉得我正受到惩罚", score: 3 }
        ]
      },
      {
        id: 7,
        text: "自我厌恶",
        options: [
          { text: "我对自己的感觉和以前一样", score: 0 },
          { text: "我对自己的感觉比以前差", score: 1 },
          { text: "我对自己感到厌烦", score: 2 },
          { text: "我憎恨我自己", score: 3 }
        ]
      },
      {
        id: 8,
        text: "自我价值感",
        options: [
          { text: "我和别人一样有价值", score: 0 },
          { text: "我比以前缺乏自信", score: 1 },
          { text: "我为自己感到失望", score: 2 },
          { text: "我讨厌我自己", score: 3 }
        ]
      },
      {
        id: 9,
        text: "自杀观念",
        options: [
          { text: "我没有自杀的念头", score: 0 },
          { text: "我有自杀的念头，但不会去实现它", score: 1 },
          { text: "我想自杀", score: 2 },
          { text: "如果有机会，我就会自杀", score: 3 }
        ]
      },
      {
        id: 10,
        text: "哭泣",
        options: [
          { text: "我现在不比以前哭得多", score: 0 },
          { text: "我现在比以前容易哭，或容易感到想哭", score: 1 },
          { text: "我现在经常哭泣", score: 2 },
          { text: "我过去常哭，但现在即使想哭也哭不出来", score: 3 }
        ]
      },
      {
        id: 11,
        text: "易激惹",
        options: [
          { text: "我和其他人一样容易激惹", score: 0 },
          { text: "我现在比以前容易激惹", score: 1 },
          { text: "我的情绪经常因一些小事而波动", score: 2 },
          { text: "我控制不住我的激惹情绪", score: 3 }
        ]
      },
      {
        id: 12,
        text: "社会退缩",
        options: [
          { text: "我对别人和以前一样感兴趣", score: 0 },
          { text: "我对别人比以前不那么感兴趣", score: 1 },
          { text: "我现在对别人失去兴趣，回避别人", score: 2 },
          { text: "我完全回避别人", score: 3 }
        ]
      },
      {
        id: 13,
        text: "犹豫不决",
        options: [
          { text: "我和以前一样容易做决定", score: 0 },
          { text: "我在做决定时比以前犹豫不决", score: 1 },
          { text: "我发现做决定比以前困难得多", score: 2 },
          { text: "我完全不能做决定了", score: 3 }
        ]
      },
      {
        id: 14,
        text: "无价值感",
        options: [
          { text: "我觉得自己像以前一样有价值", score: 0 },
          { text: "我觉得自己不像以前那样有价值", score: 1 },
          { text: "我觉得自己没有什么价值", score: 2 },
          { text: "我觉得自己毫无价值", score: 3 }
        ]
      },
      {
        id: 15,
        text: "精力丧失",
        options: [
          { text: "我像以前一样有精力", score: 0 },
          { text: "我比以前容易疲劳", score: 1 },
          { text: "我现在做事情要费很大的力气", score: 2 },
          { text: "我现在做任何事都感到费力", score: 3 }
        ]
      },
      {
        id: 16,
        text: "睡眠变化",
        options: [
          { text: "我的睡眠习惯没有改变", score: 0 },
          { text: "我的睡眠比以前多或少", score: 1 },
          { text: "我的睡眠比以前好多了或差多了", score: 2 },
          { text: "我的睡眠完全改变了（失眠或嗜睡）", score: 3 }
        ]
      },
      {
        id: 17,
        text: "易激惹",
        options: [
          { text: "我的脾气和以前一样", score: 0 },
          { text: "我现在比以前更容易发脾气", score: 1 },
          { text: "我现在经常发脾气", score: 2 },
          { text: "我现在整天发脾气", score: 3 }
        ]
      },
      {
        id: 18,
        text: "食欲变化",
        options: [
          { text: "我的食欲没有改变", score: 0 },
          { text: "我的食欲比以前差一点", score: 1 },
          { text: "我的食欲比以前差多了", score: 2 },
          { text: "我的食欲完全丧失或食欲过分旺盛", score: 3 }
        ]
      },
      {
        id: 19,
        text: "注意力不集中",
        options: [
          { text: "我能像以前一样集中注意力", score: 0 },
          { text: "我不能像以前那样容易地集中注意力", score: 1 },
          { text: "我现在集中注意力有困难", score: 2 },
          { text: "我完全不能集中注意力", score: 3 }
        ]
      },
      {
        id: 20,
        text: "疲倦或乏力",
        options: [
          { text: "我和以前一样不疲倦", score: 0 },
          { text: "我比以前容易疲倦", score: 1 },
          { text: "我现在做大部分事都感到疲倦", score: 2 },
          { text: "我现在做任何事都感到疲倦", score: 3 }
        ]
      },
      {
        id: 21,
        text: "对性的兴趣丧失",
        options: [
          { text: "我对性的兴趣和以前一样", score: 0 },
          { text: "我对性的兴趣比以前差一点", score: 1 },
          { text: "我对性的兴趣比以前差多了", score: 2 },
          { text: "我对性的兴趣完全丧失", score: 3 }
        ]
      }
    ],
    currentQuestion: 0,
    answers: [],
    result: null,
    totalScore: 0
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

  // 添加上一题功能
  prevQuestion: function() {
    if (this.data.currentQuestion > 0) {
      this.setData({
        currentQuestion: this.data.currentQuestion - 1
      });
    }
  },

  calculateResult: function () {
    const totalScore = this.data.answers.reduce((sum, score) => {
        // 处理未作答的情况，计为0分
        return sum + (typeof score === 'number' ? score : 0);
    }, 0);
    let result = {};

    if (totalScore >= 0 && totalScore <= 13) {
      result = {
        level: "无明显抑郁症状",
        description: "您的测试结果显示无明显抑郁症状。这是一个积极的信号，表明您当前的情绪状态相对良好。请继续保持健康的生活方式和积极的心态。如果您有任何担忧，或情绪出现变化，也可以与信任的人交流或寻求专业建议。",
        suggestion: "保持现状，关注积极面。"
      };
    } else if (totalScore >= 14 && totalScore <= 19) {
      result = {
        level: "轻度抑郁",
        description: "您的测试结果显示存在轻度抑郁症状。您可能偶尔感到情绪低落、兴趣减退或精力不足，但这些症状对日常生活的影响相对较小。建议您关注自己的情绪变化，尝试一些自我调节的方法，如规律作息、适度运动、培养兴趣爱好、与亲友沟通等。如果症状持续或加重，请考虑寻求专业心理咨询师的帮助。",
        suggestion: "自我调节，必要时寻求专业帮助。"
      };
    } else if (totalScore >= 20 && totalScore <= 28) {
      result = {
        level: "中度抑郁",
        description: "您的测试结果显示存在中度抑郁症状。您可能持续感到悲伤、悲观、疲惫，并对日常活动失去兴趣，这些症状已经开始对您的工作、学习或人际关系产生一定影响。强烈建议您重视自己的情绪状态，积极寻求专业心理咨询师或精神科医生的帮助，以便获得更有效的评估和干预。",
        suggestion: "寻求专业心理咨询或治疗。"
      };
    } else if (totalScore >= 29 && totalScore <= 63) {
      result = {
        level: "重度抑郁",
        description: "您的测试结果显示存在重度抑郁症状。您可能经历着非常痛苦的情绪体验，如极度悲伤、绝望、无助，并伴有严重的躯体症状（如失眠、食欲改变、注意力难以集中等），这很可能严重影响您的日常生活和社会功能。请务必尽快联系专业心理医生或精神科医生进行诊断和治疗。如果您有自伤或自杀的念头，请立即联系信任的人或拨打心理危机干预热线（如北京心理危机热线：010-82951332）寻求紧急帮助。",
        suggestion: "立即寻求专业医疗帮助。"
      };
    } else {
      // 理论上不会到达这里，因为最高分63
      result = {
        level: "结果异常",
        description: "评分计算出现异常，请重新测试或联系专业人员。",
        suggestion: "重新测试或咨询技术人员。"
      };
    }

    this.setData({
      result,
      totalScore: totalScore
    });
  },

  restartTest: function () {
    this.setData({
      currentQuestion: 0,
      answers: [],
      result: null,
      totalScore: 0
    });
  }
});




