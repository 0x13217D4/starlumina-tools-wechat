/**
 * 设备型号映射表
 * 安卓/鸿蒙设备型号与名称对应关系
 */

const deviceModels = {
  // ==================== 华为 HUAWEI ====================
  // Mate 系列
 'HUAWEI MT1-T00': ' 华为 Ascend Mate 移动版 ',
'HUAWEI MT1-U06': ' 华为 Ascend Mate 联通版 ',
'HUAWEI MT2-U071': ' 华为 Ascend Mate 2 联通 3G 版 ',
'HUAWEI MT2-C00': ' 华为 Ascend Mate 2 电信 3G 版 ',
'HUAWEI MT2-L02': ' 华为 Ascend Mate 2 移动 4G 版 ',
'HUAWEI MT2-L05': ' 华为 Ascend Mate 2 联通 4G 版 ',
'HUAWEI MT7-TL00': ' 华为 Ascend Mate 7 移动版 ',
'HUAWEI MT7-TL10': ' 华为 Ascend Mate 7 双 4G 版 ',
'HUAWEI MT7-UL00': ' 华为 Ascend Mate 7 联通版 ',
'HUAWEI MT7-CL00': ' 华为 Ascend Mate 7 电信版 ',
'HUAWEI CRR-TL00': 'HUAWEI Mate S 移动臻享版 ',
'HUAWEI CRR-UL00': 'HUAWEI Mate S 双 4G 臻享版 ',
'HUAWEI CRR-UL20': 'HUAWEI Mate S 双 4G 臻逸版 ',
'HUAWEI CRR-CL00': 'HUAWEI Mate S 电信臻享版 ',
'HUAWEI CRR-CL20': 'HUAWEI Mate S 电信臻享版',
'HUAWEI NXT-AL10': 'HUAWEI Mate 8 全网通版 ',
'HUAWEI NXT-TL00': 'HUAWEI Mate 8 移动版 ',
'HUAWEI NXT-DL00': 'HUAWEI Mate 8 双 4G 版 ',
'HUAWEI NXT-CL00': 'HUAWEI Mate 8 电信版 ',
'MHA-AL00': 'HUAWEI Mate 9 全网通版 ',
'MHA-TL00': 'HUAWEI Mate 9 移动 4G+ 版 ',
'LON-AL00': 'HUAWEI Mate 9 Pro（与保时捷设计版同型号）',
'ALP-AL00': 'HUAWEI Mate 10 全网通版 ',
'ALP-TL00': 'HUAWEI Mate 10 移动 4G+ 版 ',
'BLA-AL00': 'HUAWEI Mate 10 Pro（与保时捷设计版同型号）',
'BLA-TL00': 'HUAWEI Mate 10 Pro 移动 4G+ 版 ',
'NEO-AL00': 'HUAWEI Mate RS 保时捷设计 ',
'HMA-AL00': 'HUAWEI Mate 20 全网通版 ',
'HMA-TL00': 'HUAWEI Mate 20 移动 4G+ 版 ',
'LYA-AL00': 'HUAWEI Mate 20 Pro 全网通版 ',
'LYA-AL10': 'HUAWEI Mate 20 Pro 全网通版 (8GB+256GB)',
'LYA-TL00': 'HUAWEI Mate 20 Pro 移动 4G+ 版 ',
'EVR-AL00': 'HUAWEI Mate 20 X 全网通版 ',
'EVR-TL00': 'HUAWEI Mate 20 X 移动 4G+ 版 ',
'EVR-AN00': 'HUAWEI Mate 20 X 5G',
'LYA-AL00P': 'HUAWEI Mate 20 RS 保时捷设计 ',
'TAS-AL00': 'HUAWEI Mate 30 全网通版 ',
'TAS-TL00': 'HUAWEI Mate 30 移动 4G+ 版 ',
'TAS-AN00': 'HUAWEI Mate 30 5G 全网通版 ',
'TAS-TN00': 'HUAWEI Mate 30 5G 移动版 ',
'LIO-AL00': 'HUAWEI Mate 30 Pro 全网通版 ',
'LIO-TL00': 'HUAWEI Mate 30 Pro 移动 4G+ 版 ',
'LIO-AN00': 'HUAWEI Mate 30 Pro 5G 全网通版 ',
'LIO-TN00': 'HUAWEI Mate 30 Pro 5G 移动版 ',
'LIO-AN00m': 'HUAWEI Mate 30E Pro 5G',
'LIO-AN00P': 'HUAWEI Mate 30 RS 保时捷设计 ',
'OCE-AN10': 'HUAWEI Mate 40 5G',
'OCE-AN50': 'HUAWEI Mate 40E 5G',
'OCE-AL50': 'HUAWEI Mate 40E 4G',
'NOH-AN00': 'HUAWEI Mate 40 Pro 5G',
'NOH-AN01': 'HUAWEI Mate 40 Pro 5G',
'NOH-AL00': 'HUAWEI Mate 40 Pro 4G',
'NOH-AL10': 'HUAWEI Mate 40 Pro 4G',
'NOH-AN50': 'HUAWEI Mate 40E Pro 5G',
'NOH-AN80': 'HUAWEI Mate 40E Pro 5G',
'NOP-AN00': 'HUAWEI Mate 40 Pro+ 5G（与 RS 保时捷设计同型号）',
'CET-AL00': 'HUAWEI Mate 50',
'CET-AL60': 'HUAWEI Mate 50E',
'DCO-AL00': 'HUAWEI Mate 50 Pro / RS 保时捷设计',
'BRA-AL00': 'HUAWEI Mate 60',
'ALN-AL00': 'HUAWEI Mate 60 Pro',
'ALN-AL80': 'HUAWEI Mate 60 Pro',
'ALN-AL10': 'HUAWEI Mate 60 Pro+ / RS 非凡大师',
'CLS-AL00': 'HUAWEI Mate 70',
'CLS-AL30': 'HUAWEI Mate 70',
'PLR-AL00': 'HUAWEI Mate 70 Pro',
'PLR-AL30': 'HUAWEI Mate 70 Pro',
'PLR-AL50': 'HUAWEI Mate 70 Pro 优享版 ',
'PLA-AL10': 'HUAWEI Mate 70 Pro+',
'PLU-AL10': 'HUAWEI Mate 70 RS 非凡大师 ',
'SUP-AL90': 'HUAWEI Mate 70 Air',
'VYG-AL00': 'HUAWEI Mate 80',
'SGT-AL50': 'HUAWEI Mate 80 Pro (12GB 内存)',
'SGT-AL00': 'HUAWEI Mate 80 Pro (16GB 内存)',
'SGT-AL10': 'HUAWEI Mate 80 Pro Max',
'SGU-AL10': 'HUAWEI Mate 80 RS 非凡大师 ',
'TAH-AN00': 'HUAWEI Mate X',
'TAH-AN00m': 'HUAWEI Mate Xs (TAH-AN00m)',
'TET-AN00': 'HUAWEI Mate X2 5G',
'TET-AN10': 'HUAWEI Mate X2 5G',
'TET-AN50': 'HUAWEI Mate X2 典藏版 5G',
'TET-AL00': 'HUAWEI Mate X2 4G',
'PAL-AL00': 'HUAWEI Mate Xs 2',
'PAL-AL10': 'HUAWEI Mate Xs 2',
'ALT-AL10': 'HUAWEI Mate X5',
'ICL-AL10': 'HUAWEI Mate X6',
'ICL-AL20': 'HUAWEI Mate X6 典藏版 ',
'DEL-AL10': 'HUAWEI Mate X7',
'DEL-AL20': 'HUAWEI Mate X7 典藏版 ',
'GRL-AL10': 'HUAWEI Mate XT 非凡大师',
'GRL-AL20': 'HUAWEI Mate XTs 非凡大师',
// Pura 系列
// Pura 80系列
'HED-AL00': 'HUAWEI Pura 80',
'LMR-AL00': 'HUAWEI Pura 80 Pro+',
'LMU-AL00': 'HUAWEI Pura 80 Ultra',
// Pura 70系列
'ADY-AL00': 'HUAWEI Pura 70',
'ADY-AL10': 'HUAWEI Pura 70 北斗卫星消息版',
'HBN-AL00': 'HUAWEI Pura 70 Pro',
'HBN-AL10': 'HUAWEI Pura 70 Pro+（512GB）',
'HBN-AL80': 'HUAWEI Pura 70 Pro+（1TB）',
'HBP-AL00': 'HUAWEI Pura 70 Ultra',
// Pura X系列
'VDE-AL00': 'HUAWEI Pura X',
'VDE-AL10': 'HUAWEI Pura X 典藏版',
// P系列
'ANA-AL00': 'HUAWEI P60',
'ANA-AL10': 'HUAWEI P60 Pro',
'ANA-AL80': 'HUAWEI P60 Art',
'ABR-AL00': 'HUAWEI P50',
'ABR-AL10': 'HUAWEI P50 Pro',
'ABR-AL20': 'HUAWEI P50E',
'ANA-AN00': 'HUAWEI P40',
'ANA-AN10': 'HUAWEI P40 Pro',
'ANA-AN20': 'HUAWEI P40 Pro+',
'ELS-AN00': 'HUAWEI P30',
'ELS-AN10': 'HUAWEI P30 Pro',
'ELE-AL00': 'HUAWEI P20',
'ELE-TL00': 'HUAWEI P20',
'EML-AL00': 'HUAWEI P20',
'CLT-AL00': 'HUAWEI P20 Pro',
'CLT-TL00': 'HUAWEI P20 Pro',
'EML-AL10': 'HUAWEI P20 Pro',
'VKY-AL00': 'HUAWEI P10',
'VKY-AL10': 'HUAWEI P10 Plus',
'EVA-AL00': 'HUAWEI P9',
'EVA-AL10': 'HUAWEI P9 Plus',
'BLN-AL10': 'HUAWEI P9',
'BLN-AL20': 'HUAWEI P9 Plus',
'VIE-AL10': 'HUAWEI P9 Plus',
'GRA-UL00': 'HUAWEI P8',
'GRA-TL00': 'HUAWEI P8',
'VIE-L09': 'HUAWEI P8 Plus',
// Nova 系列
// Nova 15系列
'PSN-AL00': 'HUAWEI nova 15',
'KLE-AL00U': 'HUAWEI nova 15 Pro',
'SLY-AL00': 'HUAWEI nova 15 Ultra',
// Nova 14系列
'TLR-AL00': 'HUAWEI nova 14',
'MIA-AL00': 'HUAWEI nova 14 Pro',
'MRT-AL10': 'HUAWEI nova 14 Ultra',
'TYR-AL00': 'HUAWEI nova 14 活力版',
// Nova 13系列
'BLK-AL80': 'HUAWEI nova 13',
'MIS-AL00': 'HUAWEI nova 13 Pro',
// Nova 12系列
'BLK-AL00': 'HUAWEI nova 12',
'ADA-AL00': 'HUAWEI nova 12 Pro',
'ADA-AL00U': 'HUAWEI nova 12 Ultra',
'ADA-AL10U': 'HUAWEI nova 12 Ultra 星耀版',
// Nova Flip系列
'PSD-AL00': 'HUAWEI nova Flip',
'PSD-AL80': 'HUAWEI nova Flip S',
'BNE-AL00': 'HUAWEI nova 10 SE',
'BNE-AL10': 'HUAWEI nova 12 Pro',
'BNE-AL20': 'HUAWEI nova 12 Ultra',
'BAL-AL00': 'HUAWEI nova 11',
'BAL-AL10': 'HUAWEI nova 11 Pro',
'BAL-AL60': 'HUAWEI nova 11 Ultra',
'NAM-AL00': 'HUAWEI nova 10',
'NAM-AL10': 'HUAWEI nova 10 Pro',
'NAM-AL50': 'HUAWEI nova 10 青春版 ',
'JAD-AL00': 'HUAWEI nova 9',
'JAD-AL10': 'HUAWEI nova 9 Pro',
'JAD-AL50': 'HUAWEI nova 9 SE',
'ANG-AN00': 'HUAWEI nova 8',
'ANG-AN10': 'HUAWEI nova 8 Pro',
'JNY-AL10': 'HUAWEI nova 7',
'JNY-AN10': 'HUAWEI nova 7 Pro',
'WKG-AN00': 'HUAWEI nova 6',
'WKG-AN10': 'HUAWEI nova 6',
'SEA-AL00': 'HUAWEI nova 5i Pro',
'GLK-AL00': 'HUAWEI nova 5',
'GLK-AL10': 'HUAWEI nova 5 Pro',
'MAR-AL00': 'HUAWEI nova 4e',
'INE-AL00': 'HUAWEI nova 3i',
'PAR-AL00': 'HUAWEI nova 3',
'PAR-AL10': 'HUAWEI nova 3e',
'PIC-AL00': 'HUAWEI nova 2 Plus',
'BAC-AL00': 'HUAWEI nova 2',
'FIG-AL00': 'HUAWEI nova 2i',
'TRT-AL00': 'HUAWEI nova 1',
'WAS-AL00': 'HUAWEI nova 青春版 ',


  // 畅享系列
  'MGA-AL00': 'HUAWEI 畅享 70',
  'MGA-AL10': 'HUAWEI 畅享 70 Pro',
  'CHA-AL00': 'HUAWEI 畅享 60',
  'CHA-AL10': 'HUAWEI 畅享 60 Pro',
  'FNE-AL00': 'HUAWEI 畅享 50',
  'FNE-AL10': 'HUAWEI 畅享 50 Pro',
  'TIT-AL00': 'HUAWEI 畅享 10',
  'TIT-AL10': 'HUAWEI 畅享 10 Plus',
  'ART-AL00': 'HUAWEI 畅享 9',
  'ART-AL10': 'HUAWEI 畅享 9 Plus',

  // 麦芒系列
  'CAM-AL00': 'HUAWEI 麦芒 11',
  'CAM-AL10': 'HUAWEI 麦芒 10',
  'MYA-AL00': 'HUAWEI 麦芒 6',


  // ==================== 荣耀 HONOR ====================
  // Magic 系列
  'BVL-AN00': 'HONOR Magic V3',
  'BVL-AN10': 'HONOR Magic V3 典藏版',
  'FRI-AN00': 'HONOR Magic V2',
  'FRI-AN10': 'HONOR Magic V2 至臻版',
  'RIY-AN00': 'HONOR Magic Vs',
  'RIY-AN10': 'HONOR Magic Vs 至臻版',
  'ELZ-AN00': 'HONOR Magic V',
  'PGT-AN00': 'HONOR Magic 6',
  'PGT-AN10': 'HONOR Magic 6 Pro',
  'PGT-AN20': 'HONOR Magic 6 至臻版',
  'PGT-AN50': 'HONOR Magic 6 RSR 保时捷设计',
  'ALT-AN00': 'HONOR Magic 5',
  'ALT-AN10': 'HONOR Magic 5 Pro',
  'ALT-AN20': 'HONOR Magic 5 至臻版',
  'GIA-AN00': 'HONOR Magic 4',
  'GIA-AN10': 'HONOR Magic 4 Pro',
  'GIA-AN20': 'HONOR Magic 4 至臻版',
  'ELZ-AN00': 'HONOR Magic 3',
  'ELZ-AN10': 'HONOR Magic 3 Pro',
  'ELZ-AN20': 'HONOR Magic 3 至臻版',

  // 数字系列
  'MAA-AN00': 'HONOR 200',
  'MAA-AN10': 'HONOR 200 Pro',
  'ANY-AN00': 'HONOR 100',
  'ANY-AN10': 'HONOR 100 Pro',
  'FNE-AN00': 'HONOR 90',
  'FNE-AN10': 'HONOR 90 Pro',
  'REA-AN00': 'HONOR 80',
  'REA-AN10': 'HONOR 80 Pro',
  'ANY-AN00': 'HONOR 70',
  'ANY-AN10': 'HONOR 70 Pro',
  'ANY-AN20': 'HONOR 70 Pro+',
  'TFY-AN00': 'HONOR 60',
  'TFY-AN10': 'HONOR 60 Pro',
  'TNA-AN00': 'HONOR 50',
  'TNA-AN10': 'HONOR 50 Pro',

  // X 系列
  'VNE-AN00': 'HONOR X50',
  'VNE-AN10': 'HONOR X50 Pro',
  'ANY-AN00': 'HONOR X40',
  'ANY-AN10': 'HONOR X40 GT',
  'TFY-AN00': 'HONOR X30',
  'TFY-AN10': 'HONOR X30 Max',
  'TFY-AN20': 'HONOR X30i',
  'DIO-AN00': 'HONOR X20',
  'DIO-AN10': 'HONOR X20 SE',

  // Play 系列
  'KKG-AN00': 'HONOR Play 9C',
  'MOA-AL00': 'HONOR Play 8A',
  'KSA-AL00': 'HONOR Play 7',

  // ==================== 小米 XIAOMI ====================
  // 小米数字系列
  '2406GPNVB5': 'Xiaomi 15 Pro',
  '2406GPNVB4': 'Xiaomi 15',
  '23127PN0CC': 'Xiaomi 14 Ultra',
  '23116PN5BC': 'Xiaomi 14 Pro',
  '23116PN5DC': 'Xiaomi 14',
  '23116PN5EC': 'Xiaomi 14 Pro Ti',
  '23078PND5G': 'Xiaomi 13 Ultra',
  '2211133C': 'Xiaomi 13 Pro',
  '2211133G': 'Xiaomi 13',
  '2206123SC': 'Xiaomi 12S Ultra',
  '2206122SC': 'Xiaomi 12S Pro',
  '2206122AC': 'Xiaomi 12S',
  '2201122C': 'Xiaomi 12 Pro',
  '2201123C': 'Xiaomi 12',
  '2106118C': 'Xiaomi 11 Ultra',
  '2106119C': 'Xiaomi 11 Pro',
  '2101123C': 'Xiaomi 11',

  // MIX 系列
  '2404CUNNC': 'Xiaomi MIX Fold 4',
  '2308CPXD0C': 'Xiaomi MIX Fold 3',
  '22061218C': 'Xiaomi MIX Fold 2',
  'M2101K1C': 'Xiaomi MIX 4',
  'M2007J1SC': 'Xiaomi MIX Alpha',
  'M2011K11C': 'Xiaomi MIX FLIP',

  // Redmi K系列
  '24069RAV4C': 'Redmi K70 Ultra',
  '2311DRK48C': 'Redmi K70 Pro',
  '23113RKC6C': 'Redmi K70',
  '23117RK66C': 'Redmi K70E',
  '23078RKD5C': 'Redmi K60 Ultra',
  '22127RK46C': 'Redmi K60 Pro',
  '22127RK33C': 'Redmi K60',
  '22122RK93C': 'Redmi K60E',
  '22081212C': 'Redmi K50 Ultra',
  '22021211C': 'Redmi K50 Pro',
  '22021211RC': 'Redmi K50',
  '2201117PG': 'Redmi K50G',
  '2106118SR': 'Redmi K40 游戏增强版',
  'M2012K11C': 'Redmi K40S',
  'M2012K11AC': 'Redmi K40 Pro+',
  'M2012K11G': 'Redmi K40 Pro',
  'M2012K10C': 'Redmi K40',

  // Redmi Note系列
  '24090RAV4C': 'Redmi Note 14 Pro+',
  '24090RAV3C': 'Redmi Note 14 Pro',
  '24094RAD3C': 'Redmi Note 14',
  '23106RNA0C': 'Redmi Note 13 Pro+',
  '2312ERA50C': 'Redmi Note 13 Pro',
  '2312ERA60C': 'Redmi Note 13',
  '23090RAV3C': 'Redmi Note 12 Turbo',
  '22111316C': 'Redmi Note 12 Pro+',
  '22101316C': 'Redmi Note 12 Pro',
  '22101316UC': 'Redmi Note 12 探索版',
  '22111317C': 'Redmi Note 12',

  // ==================== OPPO ====================
  // Find 系列
  'PHZ110': 'OPPO Find X7 Ultra',
  'PHY110': 'OPPO Find X7 Pro',
  'PFFM10': 'OPPO Find X7',
  'PGBM10': 'OPPO Find X6 Pro',
  'PGEM10': 'OPPO Find X6',
  'PFDM00': 'OPPO Find X5 Pro',
  'PFFM00': 'OPPO Find X5',
  'PEDM00': 'OPPO Find X3 Pro',
  'PEEM00': 'OPPO Find X3',
  'PDSM00': 'OPPO Find X2 Pro',
  'PDTM00': 'OPPO Find X2',

  // Reno 系列
  'PJU110': 'OPPO Reno 12 Pro',
  'PJU110': 'OPPO Reno 12',
  'PJT110': 'OPPO Reno 11 Pro',
  'PJC110': 'OPPO Reno 11',
  'PGG110': 'OPPO Reno 10 Pro+',
  'PGF110': 'OPPO Reno 10 Pro',
  'PGD110': 'OPPO Reno 10',
  'PFDM00': 'OPPO Reno 9 Pro+',
  'PFC00': 'OPPO Reno 9 Pro',
  'PFEM10': 'OPPO Reno 9',
  'PEG10': 'OPPO Reno 8 Pro+',
  'PFT10': 'OPPO Reno 8 Pro',
  'PGAM10': 'OPPO Reno 8',

  // A 系列
  'PJE110': 'OPPO A3 Pro',
  'PHM10': 'OPPO A2 Pro',
  'PGW10': 'OPPO A2',
  'PFTM10': 'OPPO A1 Pro',
  'PFC10': 'OPPO A1',
  'PEQM10': 'OPPO A98',
  'PEPM10': 'OPPO A97',
  'PEEM10': 'OPPO A96',
  'PEDM10': 'OPPO A95',

  // ==================== vivo ====================
  // X 系列
  'V2344A': 'vivo X100 Ultra',
  'V2324A': 'vivo X100 Pro',
  'V2323A': 'vivo X100',
  'V2254A': 'vivo X90 Pro+',
  'V2241A': 'vivo X90 Pro',
  'V2240A': 'vivo X90',
  'V2185A': 'vivo X80 Pro',
  'V2184A': 'vivo X80',
  'V2145A': 'vivo X70 Pro+',
  'V2144A': 'vivo X70 Pro',
  'V2132A': 'vivo X70',
  'V2072A': 'vivo X60 Pro+',
  'V2047A': 'vivo X60 Pro',
  'V2046A': 'vivo X60',

  // X Fold 系列
  'V2337A': 'vivo X Fold 3 Pro',
  'V2336A': 'vivo X Fold 3',
  'V2237A': 'vivo X Fold 2',
  'V2178A': 'vivo X Fold',
  'V2205A': 'vivo X Note',

  // S 系列
  'V2353A': 'vivo S19 Pro',
  'V2352A': 'vivo S19',
  'V2334A': 'vivo S18 Pro',
  'V2333A': 'vivo S18',
  'V2307A': 'vivo S17 Pro',
  'V2283A': 'vivo S17',
  'V2258A': 'vivo S16 Pro',
  'V2257A': 'vivo S16',
  'V2208A': 'vivo S15 Pro',
  'V2207A': 'vivo S15',

  // iQOO 系列
  'V2339A': 'iQOO 12 Pro',
  'V2338A': 'iQOO 12',
  'V2243A': 'iQOO 11 Pro',
  'V2242A': 'iQOO 11',
  'V2217A': 'iQOO 10 Pro',
  'V2216A': 'iQOO 10',
  'V2171A': 'iQOO 9 Pro',
  'V2170A': 'iQOO 9',
  'V2135A': 'iQOO 8 Pro',
  'V2134A': 'iQOO 8',
  'V2071A': 'iQOO 7',
  'V2335A': 'iQOO Neo9S Pro',
  'V2331A': 'iQOO Neo9 Pro',
  'V2330A': 'iQOO Neo9',
  'V2309A': 'iQOO Neo8 Pro',
  'V2301A': 'iQOO Neo8',
  'V2260A': 'iQOO Neo7 Pro',
  'V2259A': 'iQOO Neo7',

  // ==================== 三星 SAMSUNG ====================
  // Galaxy S 系列
  'SM-S938B': 'Samsung Galaxy S24 Ultra',
  'SM-S928B': 'Samsung Galaxy S24+',
  'SM-S921B': 'Samsung Galaxy S24',
  'SM-S918B': 'Samsung Galaxy S23 Ultra',
  'SM-S916B': 'Samsung Galaxy S23+',
  'SM-S911B': 'Samsung Galaxy S23',
  'SM-S908B': 'Samsung Galaxy S22 Ultra',
  'SM-S906B': 'Samsung Galaxy S22+',
  'SM-S901B': 'Samsung Galaxy S22',
  'SM-G998B': 'Samsung Galaxy S21 Ultra',
  'SM-G996B': 'Samsung Galaxy S21+',
  'SM-G991B': 'Samsung Galaxy S21',

  // Galaxy Z Fold 系列
  'SM-F956B': 'Samsung Galaxy Z Fold6',
  'SM-F946B': 'Samsung Galaxy Z Fold5',
  'SM-F936B': 'Samsung Galaxy Z Fold4',
  'SM-F926B': 'Samsung Galaxy Z Fold3',

  // Galaxy Z Flip 系列
  'SM-F731B': 'Samsung Galaxy Z Flip6',
  'SM-F721B': 'Samsung Galaxy Z Flip5',
  'SM-F711B': 'Samsung Galaxy Z Flip4',
  'SM-F707B': 'Samsung Galaxy Z Flip3',

  // Galaxy A 系列
  'SM-A556B': 'Samsung Galaxy A55',
  'SM-A546B': 'Samsung Galaxy A54',
  'SM-A536B': 'Samsung Galaxy A53',
  'SM-A526B': 'Samsung Galaxy A52',
  'SM-A356B': 'Samsung Galaxy A35',
  'SM-A346B': 'Samsung Galaxy A34',
  'SM-A336B': 'Samsung Galaxy A33',

  // ==================== 一加 ONEPLUS ====================
  'CPH2653': 'OnePlus 12',
  'CPH2581': 'OnePlus 12R',
  'CPH2449': 'OnePlus Open',
  'CPH2401': 'OnePlus 11',
  'CPH2449': 'OnePlus 11R',
  'CPH2399': 'OnePlus 10 Pro',
  'CPH2381': 'OnePlus Ace 3 Pro',
  'CPH2607': 'OnePlus Ace 3',
  'CPH2487': 'OnePlus Ace 2 Pro',
  'CPH2469': 'OnePlus Ace 2',

  // ==================== 魅族 MEIZU ====================
  'MEIZU 21 PRO': 'Meizu 21 PRO',
  'MEIZU 21': 'Meizu 21',
  'MEIZU 21 Note': 'Meizu 21 Note',
  'MEIZU 20 PRO': 'Meizu 20 PRO',
  'MEIZU 20': 'Meizu 20',
  'MEIZU 20 INFINITY': 'Meizu 20 INFINITY',
  'M1915': 'Meizu 18 Pro',
  'M1912': 'Meizu 18',
  'M1918': 'Meizu 18x',

  // ==================== 真我 realme ====================
  'RMX3951': 'realme GT7 Pro',
  'RMX3941': 'realme GT6',
  'RMX3921': 'realme GT5 Pro',
  'RMX3888': 'realme GT5',
  'RMX3851': 'realme GT Neo7',
  'RMX3708': 'realme GT Neo6',
  'RMX3686': 'realme GT Neo5',
  'RMX3970': 'realme 13 Pro+',
  'RMX3880': 'realme 12 Pro+',
  'RMX3868': 'realme 12 Pro',
  'RMX3660': 'realme 11 Pro+',
  'RMX3650': 'realme 11 Pro',
  'RMX3630': 'realme 11',

  // ==================== 中兴 ZTE ====================
  'ZTE A2024': 'ZTE nubia Z60 Ultra',
  'ZTE A2023': 'ZTE nubia Z50 Ultra',
  'ZTE A2022': 'ZTE nubia Z50',
  'ZTE A2021': 'ZTE nubia Z40 Pro',
  'ZTE A2121': 'ZTE Axon 40 Ultra',
  'ZTE A2022': 'ZTE Axon 30',

  // ==================== 联想 Lenovo ====================
  'L78032': 'Lenovo 拯救者 Y70',
  'L78011': 'Lenovo 拯救者电竞手机2 Pro',
  'L70081': 'Lenovo 拯救者电竞手机',
  'L78051': 'Lenovo moto razr 40 Ultra',
  'L78052': 'Lenovo moto razr 40',
  'L78031': 'Lenovo moto edge 40',
  'L78021': 'Lenovo moto edge 30',

  // ==================== 努比亚 nubia ====================
  'NX729J': 'nubia Z60 Ultra',
  'NX721J': 'nubia Z50S Pro',
  'NX711J': 'nubia Z50 Ultra',
  'NX701J': 'nubia Z50',
  'NX689J': 'nubia Z40S Pro',
  'NX702J': 'nubia Z40 Pro',

  // ==================== 索尼 Sony ====================
  'XQ-ES72': 'Xperia 10 VI',
  'XQ-EC72': 'Xperia 10 V',
  'XQ-DC72': 'Xperia 10 IV',
  'XQ-DQ72': 'Xperia 1 VI',
  'XQ-CQ72': 'Xperia 1 V',
  'XQ-BQ72': 'Xperia 1 IV',
  'XQ-AT72': 'Xperia 1 III',
  'XQ-CT72': 'Xperia 5 V',
  'XQ-AT52': 'Xperia 5 III',
  'XQ-AS72': 'Xperia 5 II',

  // ==================== 华硕 ASUS ====================
  'ASUS_I006DA': 'ROG Phone 8 Pro',
  'ASUS_I006DE': 'ROG Phone 8',
  'ASUS_AI2201': 'ROG Phone 7 Ultimate',
  'ASUS_AI2205': 'ROG Phone 7',
  'ASUS_I005DA': 'ROG Phone 6 Pro',
  'ASUS_I005DE': 'ROG Phone 6',
  'ASUS_I004DE': 'ROG Phone 5s Pro',
  'ASUS_I005AA': 'ROG Phone 5s',
  'ASUS_I003DD': 'ROG Phone 5',

  // ==================== 其他品牌 ====================
  'GIONEE M12': '金立 M12',
  'GIONEE M11': '金立 M11',
  'COOLPAD CP11': '酷派 COOL 30',
  'COOLPAD CP10': '酷派 COOL 20',
  'SUGAR C18': '糖果 C18',
  'SUGAR C17': '糖果 C17',
  'LEAGOO T10': '领歌 T10',
  'DOOGEE V30': '道格 V30',
  'ULEFONE POWER_ARMOR_19': '优丰 POWER ARMOR 19',
};

/**
 * 根据设备型号获取设备名称
 * @param {string} model 设备型号
 * @returns {string} 设备名称，如果未找到则返回原型号
 */
function getDeviceName(model) {
  if (!model) return model;
  
  // 直接匹配
  if (deviceModels[model]) {
    return deviceModels[model];
  }
  
  // 尝试大写匹配（型号通常大写）
  const upperModel = model.toUpperCase();
  if (deviceModels[upperModel]) {
    return deviceModels[upperModel];
  }
  
  // 尝试去掉空格后匹配
  const noSpaceModel = model.replace(/\s+/g, '');
  if (deviceModels[noSpaceModel]) {
    return deviceModels[noSpaceModel];
  }
  
  // 尝试部分匹配
  for (const key in deviceModels) {
    if (model.includes(key) || key.includes(model)) {
      return deviceModels[key];
    }
  }
  
  // 未找到映射，返回原型号
  return model;
}

/**
 * 判断是否为已知设备型号
 * @param {string} model 设备型号
 * @returns {boolean} 是否为已知型号
 */
function isKnownDevice(model) {
  if (!model) return false;
  const upperModel = model.toUpperCase();
  return !!deviceModels[model] || !!deviceModels[upperModel];
}

/**
 * 根据品牌获取该品牌的所有设备
 * @param {string} brand 品牌（如 'HUAWEI', 'XIAOMI'）
 * @returns {Array} 该品牌的设备列表
 */
function getDevicesByBrand(brand) {
  const devices = [];
  const brandUpper = brand.toUpperCase();
  
  for (const [model, name] of Object.entries(deviceModels)) {
    if (name.toUpperCase().includes(brandUpper)) {
      devices.push({ model, name });
    }
  }
  
  return devices;
}

module.exports = {
  deviceModels,
  getDeviceName,
  isKnownDevice,
  getDevicesByBrand
};