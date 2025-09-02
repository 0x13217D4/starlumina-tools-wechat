Page({
  onShareAppMessage() {
    return {
      title: 'MBTI性格测试 - 星芒集盒',
      path: '/pages/mbti/mbti',
      imageUrl: '/images/logo.jpg'
    }
  },
  onShareTimeline() {
    return {
      title: 'MBTI性格测试 - 星芒集盒',
      path: '/pages/mbti/mbti',
      imageUrl: '/images/logo.jpg'
    }
  },
  data: {
    questions: [],
    currentQuestion: 0,
    answers: [],
    result: null
  },
  
  onLoad: function() {
    // 初始化问题和选项
    this.setData({
      questions: [
        // E/I维度问题 (共6个)
        {
          id: 1,
          text: "在社交场合中，你通常",
          dimension: "EI",
          options: [
            {text: "主动与他人交流", type: "E"},
            {text: "等待别人先开口", type: "I"}
          ]
        },
        {
          id: 2,
          text: "你更喜欢",
          dimension: "EI",
          options: [
            {text: "参加热闹的聚会", type: "E"},
            {text: "安静地独处或与一两个好友相处", type: "I"}
          ]
        },
        {
          id: 3,
          text: "当你需要充电时，你更倾向于",
          dimension: "EI",
          options: [
            {text: "和朋友出去玩", type: "E"},
            {text: "一个人待着", type: "I"}
          ]
        },
        {
          id: 4,
          text: "在团队讨论中，你通常是",
          dimension: "EI",
          options: [
            {text: "积极发言，表达观点", type: "E"},
            {text: "先倾听，再谨慎表达", type: "I"}
          ]
        },
        {
          id: 5,
          text: "你认为自己更像",
          dimension: "EI",
          options: [
            {text: "一个善于交际的人", type: "E"},
            {text: "一个深思熟虑的人", type: "I"}
          ]
        },
        {
          id: 6,
          text: "周末时，你更愿意",
          dimension: "EI",
          options: [
            {text: "参加社交活动或户外运动", type: "E"},
            {text: "在家看书、看电影或做自己喜欢的事", type: "I"}
          ]
        },
        
        // S/N维度问题 (共6个)
        {
          id: 7,
          text: "你更倾向于",
          dimension: "SN",
          options: [
            {text: "关注具体的事实和细节", type: "S"},
            {text: "关注整体概念和可能性", type: "N"}
          ]
        },
        {
          id: 8,
          text: "你更相信",
          dimension: "SN",
          options: [
            {text: "实际经验和证据", type: "S"},
            {text: "直觉和灵感", type: "N"}
          ]
        },
        {
          id: 9,
          text: "在学习新知识时，你更喜欢",
          dimension: "SN",
          options: [
            {text: "按部就班地学习具体步骤", type: "S"},
            {text: "理解背后的原理和联系", type: "N"}
          ]
        },
        {
          id: 10,
          text: "你更关注",
          dimension: "SN",
          options: [
            {text: "现在正在发生的事情", type: "S"},
            {text: "未来的可能性和潜在趋势", type: "N"}
          ]
        },
        {
          id: 11,
          text: "当解决问题时，你更依赖",
          dimension: "SN",
          options: [
            {text: "过去的经验和已知的方法", type: "S"},
            {text: "创新的想法和新的途径", type: "N"}
          ]
        },
        {
          id: 12,
          text: "你觉得哪种描述更符合你",
          dimension: "SN",
          options: [
            {text: "现实主义者，脚踏实地", type: "S"},
            {text: "梦想家，富有想象力", type: "N"}
          ]
        },
        
        // T/F维度问题 (共6个)
        {
          id: 13,
          text: "做决定时，你更注重",
          dimension: "TF",
          options: [
            {text: "逻辑和客观分析", type: "T"},
            {text: "价值观和人际关系", type: "F"}
          ]
        },
        {
          id: 14,
          text: "你更倾向于",
          dimension: "TF",
          options: [
            {text: "公正和诚实", type: "T"},
            {text: "和谐和体谅", type: "F"}
          ]
        },
        {
          id: 15,
          text: "在评价他人时，你更看重",
          dimension: "TF",
          options: [
            {text: "能力和效率", type: "T"},
            {text: "善意和动机", type: "F"}
          ]
        },
        {
          id: 16,
          text: "当朋友向你倾诉烦恼时，你通常",
          dimension: "TF",
          options: [
            {text: "帮他分析问题并给出解决方案", type: "T"},
            {text: "给予情感支持和安慰", type: "F"}
          ]
        },
        {
          id: 17,
          text: "你认为自己更像",
          dimension: "TF",
          options: [
            {text: "冷静理性的人", type: "T"},
            {text: "温暖感性的人", type: "F"}
          ]
        },
        {
          id: 18,
          text: "在工作中，你更偏好",
          dimension: "TF",
          options: [
            {text: "基于数据和事实做决策", type: "T"},
            {text: "考虑团队成员的感受", type: "F"}
          ]
        },
        
        // J/P维度问题 (共6个)
        {
          id: 19,
          text: "你更喜欢",
          dimension: "JP",
          options: [
            {text: "有计划、有组织的生活方式", type: "J"},
            {text: "灵活、随性的生活方式", type: "P"}
          ]
        },
        {
          id: 20,
          text: "面对任务时，你通常",
          dimension: "JP",
          options: [
            {text: "提前规划并按时完成", type: "J"},
            {text: "在最后期限前完成", type: "P"}
          ]
        },
        {
          id: 21,
          text: "在旅行前，你会",
          dimension: "JP",
          options: [
            {text: "制定详细的行程计划", type: "J"},
            {text: "只订好住宿，其他走一步看一步", type: "P"}
          ]
        },
        {
          id: 22,
          text: "你的工作/学习环境通常是",
          dimension: "JP",
          options: [
            {text: "整洁有序的", type: "J"},
            {text: "随意但自己知道放在哪", type: "P"}
          ]
        },
        {
          id: 23,
          text: "你更倾向于",
          dimension: "JP",
          options: [
            {text: "早点做决定，不喜欢悬而未决", type: "J"},
            {text: "保持选择的开放性，喜欢灵活应对", type: "P"}
          ]
        },
        {
          id: 24,
          text: "你认为自己更像",
          dimension: "JP",
          options: [
            {text: "喜欢按计划行事的人", type: "J"},
            {text: "喜欢随遇而安的人", type: "P"}
          ]
        }
      ]
    });
  },
  
  selectOption: function(e) {
    // 处理用户选择
    const {index} = e.currentTarget.dataset;
    const {questions, currentQuestion, answers} = this.data;
    const selectedType = questions[currentQuestion].options[index].type;
    
    // 使用新数组更新答案，避免直接修改原数组
    const newAnswers = [...answers, selectedType];
    this.setData({answers: newAnswers});
    
    if (currentQuestion < questions.length - 1) {
      this.setData({currentQuestion: currentQuestion + 1});
    } else {
      this.calculateResult();
    }
  },
  
  calculateResult: function() {
    const {answers} = this.data;
    
    // 计算各维度得分
    const eCount = answers.filter(a => a === "E").length;
    const iCount = answers.filter(a => a === "I").length;
    const sCount = answers.filter(a => a === "S").length;
    const nCount = answers.filter(a => a === "N").length;
    const tCount = answers.filter(a => a === "T").length;
    const fCount = answers.filter(a => a === "F").length;
    const jCount = answers.filter(a => a === "J").length;
    const pCount = answers.filter(a => a === "P").length;
    
    // 确定各维度类型
    const eiType = eCount >= iCount ? "E" : "I"; // 修改为 >= 以处理相等情况
    const snType = sCount >= nCount ? "S" : "N";
    const tfType = tCount >= fCount ? "T" : "F";
    const jpType = jCount >= pCount ? "J" : "P";
    
    const mbtiType = eiType + snType + tfType + jpType;
    
    // MBTI类型描述 (更详细)
    const typeDescriptions = {
      "ISTJ": {
        name: "检查员型",
        description: "严肃、安静、负责任且有良心。他们行事有条不紊，实事求是，脚踏实地，注重逻辑和事实，讲求实际，有责任感和准确性。他们忠诚，值得信赖，勤奋，且通常是很好的守护者。"
      },
      "ISFJ": {
        name: "守护者型",
        description: "安静、友善、有责任感且谨慎。他们通常会协调和执行具体任务，确保事情能被完成。他们关注细节，有条理，记得过去，关心他人的感受。他们是忠诚的守护者，致力于服务他人和组织。"
      },
      "INFJ": {
        name: "提倡者型",
        description: "寻求意义和联系的理想主义者。他们有清晰的愿景，并积极努力去实现。他们通常有深刻的洞察力，对自我和他人有强烈的直觉。他们有原则，有同情心，且对自己的价值观坚定不移。"
      },
      "INTJ": {
        name: "建筑师型",
        description: "富有想象力和战略性的思想家，一切皆在计划之中。他们拥有内化的知识体系和远见卓识。他们通常思维缜密，逻辑性强，独立自主，且有强烈的动机去实现自己的想法和目标。他们意志坚定，有时会有些挑剔。"
      },
      "ISTP": {
        name: "鉴赏家型",
        description: "灵活、忍耐力强，能适应各种情况。他们喜欢观察和分析，是冷静的行动派。他们通常动手能力强，善于解决问题，喜欢独立工作。他们对机械和物理原理感兴趣，且通常比较内向。"
      },
      "ISFP": {
        name: "冒险家型",
        description: "温和、谦逊、有同理心，喜欢以自己的方式帮助他人。他们通常敏感、随和、适应性强。他们重视美、和谐以及个人价值观。他们通常比较害羞，但对亲近的人非常忠诚和热情。"
      },
      "INFP": {
        name: "调停者型",
        description: "诗意、善良的利他主义者，总是热情地提供帮助。他们通常理想主义，追求自己的价值观和内心深处的信念。他们好奇、有创造力，且渴望理解。他们寻求意义和可能性，且通常比较内向和敏感。"
      },
      "INTP": {
        name: "思想家型",
        description: "具有创造力的思想家，对知识有强烈的渴望。他们通常逻辑性强，善于分析，且喜欢独立思考和解决问题。他们喜欢探索理论和概念，追求理解和掌握事物的本质。他们通常比较内向，对社交活动不太感兴趣。"
      },
      "ESTP": {
        name: "企业家型",
        description: "聪明、精力充沛、善于观察，喜欢有刺激性、有形的活动。他们通常是实用主义者，喜欢立刻行动去解决问题。他们适应性强，生活能力强，且通常很受欢迎。他们喜欢与人打交道，且通常比较外向。"
      },
      "ESFP": {
        name: "表演者型",
        description: "热情、友好、充满活力，总能带来欢乐。他们通常很受欢迎，善于交际，且喜欢成为关注的焦点。他们享受当下，对生活充满热情。他们通常比较随和，不喜欢冲突，且有很强的同理心。"
      },
      "ENFP": {
        name: "竞选者型",
        description: "热情、有创造力且善于鼓舞人心的自由思想者。他们通常精力充沛，乐观，且富有想象力。他们喜欢探索新的可能性，且通常比较外向和直觉。他们有很强的同理心，且通常能激励他人。"
      },
      "ENTP": {
        name: "辩论家型",
        description: "聪明好奇的创新者，不会放弃任何智力上的挑战。他们通常思维敏捷，善于辩论，且喜欢探索新的想法和可能性。他们通常是战略家，能看到事物的多种可能性。他们喜欢挑战和变化，且通常比较外向。"
      },
      "ESTJ": {
        name: "总经理型",
        description: "出色的管理者，在管理事务或领导他人方面都很在行。他们通常是务实、有责任心、自律的人。他们重视秩序、规则和效率。他们通常是很好的组织者，且能有效地完成任务。"
      },
      "ESFJ": {
        name: "执政官型",
        description: "热心、负责且合作的守护者，总是忙碌且乐于助人。他们通常很受欢迎，关心他人的需求和感受。他们重视和谐、合作和传统。他们通常是很好的团队成员，且能营造积极的工作氛围。"
      },
      "ENFJ": {
        name: "主人公型",
        description: "富有魅力且鼓舞人心的领导者，能够激发他人的潜能。他们通常有远见，且有很强的同理心。他们关心他人的成长和发展，且通常是很好的导师和教练。他们有很强的沟通能力，且通常比较外向。"
      },
      "ENTJ": {
        name: "指挥官型",
        description: "大胆、富有想象力且意志坚定的领导者，总能创造长期的计划并完成目标。他们通常是战略家，能看到全局。他们自信、果断，且有很强的领导能力。他们重视效率和结果，且通常比较外向和思维。"
      }
    };
    
    this.setData({
      result: {
        type: mbtiType,
        name: typeDescriptions[mbtiType]?.name || "未知类型",
        description: typeDescriptions[mbtiType]?.description || "你的MBTI类型是" + mbtiType
      }
    });
  },
  
  restartTest: function() {
    this.setData({
      currentQuestion: 0,
      answers: [],
      result: null
    });
  }
});



