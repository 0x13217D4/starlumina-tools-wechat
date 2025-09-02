Page({
  onShareAppMessage() {
    return {
      title: '心理测评 - 星芒集盒',
      path: '/pages/psychology-test/psychology-test',
      imageUrl: '/images/logo.jpg'
    }
  },
  onShareTimeline() {
    return {
      title: '心理测评 - 星芒集盒',
      path: '/pages/psychology-test/psychology-test',
      imageUrl: '/images/logo.jpg'
    }
  },
  data: {
    scales: [
      {
        id: 'sas',
        name: '焦虑自评量表(SAS)',
        description: '用于评估焦虑症状的严重程度',
        questionsCount: 20
      },
      {
        id: 'sds',
        name: '抑郁自评量表(SDS)',
        description: '用于评估抑郁症状的严重程度',
        questionsCount: 20
      },
      {
        id: 'scl90',
        name: '心理健康自评量表(SCL90)',
        description: '综合评估多种心理症状',
        questionsCount: 90
      },
      {
        id: 'bdi',
        name: 'Beck抑郁自评问卷(BDI)',
        description: '评估抑郁症状的严重程度',
        questionsCount: 21
      }
    ]
  },

  navigateToScale: function(e) {
    const scaleId = e.currentTarget.dataset.id;
    if (['sas', 'sds', 'scl90', 'bdi'].includes(scaleId)) {
      wx.navigateTo({
        url: `/pages/psychology-test/${scaleId}/${scaleId}`
      });
    } else {
      wx.showToast({
        title: '量表暂未开放',
        icon: 'none'
      });
    }
  }
});