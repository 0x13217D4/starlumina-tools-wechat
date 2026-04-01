/**
 * 性能测试分数计算模块
 * 线性无限制分数计算，完全基于操作数反映设备性能
 */

/**
 * 计算性能分数
 * @param {string} testType - 测试类型
 * @param {number} operations - 完成的操作次数
 * @param {object} deviceInfo - 设备信息
 * @returns {number} 分数（无上下限限制）
 */
function calculatePerformanceScore(testType, operations, deviceInfo) {
  if (!operations || operations <= 0) {
    return 0;
  }

  // 为每个测试类型设定基础系数
  const coefficients = {
    cpu: 30,
    memory: 0.008,
    storage: 1,
    gpu: 100
  };
  
  let coefficient = coefficients[testType] || 1.0;
  
  // 平台特定调整
  const currentDeviceInfo = wx.getDeviceInfo();
  
  // 检测鸿蒙系统 (真实设备)
  if (currentDeviceInfo.platform === 'ohos') {
    const ohosMultipliers = {
      cpu: 21.6,
      memory: 10.55,
      storage: 4.76,
      gpu: 54.4
    };
    const multiplier = ohosMultipliers[testType] || 1;
    coefficient = coefficient * multiplier;
  } else if (currentDeviceInfo.system === 'HarmonyOS') {  // 开发者工具中模拟鸿蒙
    const harmonyOSMultipliers = {
      cpu: 21.6,
      memory: 10.55,
      storage: 4.76,
      gpu: 54.4
    };
    const multiplier = harmonyOSMultipliers[testType] || 1;
    coefficient = coefficient * multiplier;
  } else if (currentDeviceInfo.platform === 'ios') {
    const iosMultipliers = {
      cpu: 21.6,
      memory: 10.55,
      storage: 4.76,
      gpu: 54.4
    };
    const multiplier = iosMultipliers[testType] || 1;
    coefficient = coefficient * multiplier;
  } else if (currentDeviceInfo.platform === 'windows') {  // Windows平台倍数调整
    const windowsMultipliers = {
      cpu: 2.11,
      memory: 0.69,
      storage: 3.75,
      gpu: 7.18
    };
    const multiplier = windowsMultipliers[testType] || 1;
    coefficient = coefficient * multiplier;
  }
  
  // 完全基于操作数计算，无上下限
  const score = Math.round(operations * coefficient);
  
  return score;
}

/**
 * 获取性能等级
 * @param {object} scores - 各项分数对象 {cpu, gpu, memory, storage}
 * @returns {object} 性能等级信息
 */
function getPerformanceGrade(scores) {
  // 计算各项分数的平均值
  const avgScore = (scores.cpu + scores.gpu + scores.memory + scores.storage) / 4;
  
  // 基于平均值判断等级（动态调整，无固定分数区间）
  const grades = [
    { max: Infinity, description: '卓越性能', color: '#52c41a', level: 'S+' },
    { max: 10000, description: '旗舰性能', color: '#13c2c2', level: 'A+' },
    { max: 5000, description: '高端性能', color: '#1890ff', level: 'A' },
    { max: 2000, description: '中端性能', color: '#722ed1', level: 'B+' },
    { max: 1000, description: '入门性能', color: '#fa8c16', level: 'B' },
    { max: 500, description: '基础性能', color: '#fa541c', level: 'C' },
    { max: 0, description: '待提升', color: '#f5222d', level: 'D' }
  ];
  
  // 从高到低查找合适的等级
  for (let i = 0; i < grades.length; i++) {
    if (avgScore >= grades[i].max) {
      return grades[i];
    }
  }
  
  // 如果分数低于所有等级，返回最低等级
  return grades[grades.length - 1];
}

/**
 * 根据分数获取设备分类（已废弃，保留参数兼容性）
 * @param {number} score - 总分
 * @returns {string} 设备分类
 */
function getDeviceCategoryFromScore(score) {
  if (score >= 10000) return 'flagship';
  if (score >= 5000) return 'high_end';
  if (score >= 2000) return 'upper_mid';
  if (score >= 1000) return 'mid_range';
  if (score >= 500) return 'entry_level';
  return 'low_end';
}

module.exports = {
  calculatePerformanceScore,
  getPerformanceGrade,
  getDeviceCategoryFromScore
};