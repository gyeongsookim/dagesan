/**
 * 다계산 Calculations Engine
 * 2026 대한민국 최신 법정 기준 반영
 */

// 숫자 포맷터 (1,000 단위 콤마)
function formatNumber(num) {
  if (isNaN(num) || num === null || num === undefined) return '0';
  return Math.round(num).toLocaleString('ko-KR');
}

// 콤마 제거 후 숫자로 변환
function parseCleanNumber(val) {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  return parseFloat(val.toString().replace(/,/g, '')) || 0;
}

/**
 * 1. 2026 연봉 실수령액 계산기
 * @param {number} annualSalary - 연봉 (원)
 * @param {number} nonTaxable - 월 비과세액 (기본 식대 200,000원)
 * @param {number} dependents - 본인 포함 부양가족 수 (기본 1)
 * @param {number} childrenUnder20 - 20세 이하 자녀 수 (기본 0)
 */
function calculateSalary(annualSalary, nonTaxable = 200000, dependents = 1, childrenUnder20 = 0) {
  const monthlySalary = annualSalary / 12;
  const taxableIncome = Math.max(0, monthlySalary - nonTaxable);

  // 1. 국민연금 (4.5%, 상한액 기준 6,170,000원 -> 최대 277,650원)
  const pensionBasis = Math.min(6170000, Math.max(390000, taxableIncome));
  const nationalPension = Math.floor(pensionBasis * 0.045);

  // 2. 건강보험 (3.545%)
  const healthInsurance = Math.floor(taxableIncome * 0.03545);

  // 3. 장기요양보험 (건강보험료의 12.95%)
  const longTermCare = Math.floor(healthInsurance * 0.1295);

  // 4. 고용보험 (0.9%)
  const employmentInsurance = Math.floor(taxableIncome * 0.009);

  // 5. 근로소득세 (간이세액표 근사 계산식 적용)
  // 과세표준 구간별 근로소득공제 및 기본공제(부양가족당 12.5만원/월) 감안
  const familyDeduction = (dependents + childrenUnder20) * 125000;
  const estimatedTaxBase = Math.max(0, taxableIncome - familyDeduction - (nationalPension + healthInsurance + employmentInsurance));
  
  let incomeTax = 0;
  if (taxableIncome <= 1060000) {
    incomeTax = 0;
  } else if (estimatedTaxBase <= 1200000) {
    incomeTax = estimatedTaxBase * 0.06;
  } else if (estimatedTaxBase <= 4000000) {
    incomeTax = 72000 + (estimatedTaxBase - 1200000) * 0.15;
  } else if (estimatedTaxBase <= 7300000) {
    incomeTax = 492000 + (estimatedTaxBase - 4000000) * 0.24;
  } else {
    incomeTax = 1284000 + (estimatedTaxBase - 7300000) * 0.35;
  }

  // 자녀세액공제 적용 (8세~20세 자녀 1명 12,500원/월, 2명 29,160원/월)
  let childTaxCredit = 0;
  if (childrenUnder20 === 1) childTaxCredit = 12500;
  else if (childrenUnder20 >= 2) childTaxCredit = 29160 + (childrenUnder20 - 2) * 25000;
  
  incomeTax = Math.max(0, Math.floor((incomeTax - childTaxCredit) / 10) * 10);

  // 6. 지방소득세 (소득세의 10%)
  const localIncomeTax = Math.floor((incomeTax * 0.1) / 10) * 10;

  // 공제총액
  const totalDeductions = nationalPension + healthInsurance + longTermCare + employmentInsurance + incomeTax + localIncomeTax;

  // 월 실수령액 & 연간 실수령액
  const monthlyNet = Math.floor(monthlySalary - totalDeductions);
  const annualNet = monthlyNet * 12;

  return {
    annualSalary,
    monthlySalary: Math.floor(monthlySalary),
    taxableIncome: Math.floor(taxableIncome),
    nonTaxable: Math.floor(nonTaxable),
    nationalPension,
    healthInsurance,
    longTermCare,
    employmentInsurance,
    incomeTax,
    localIncomeTax,
    totalDeductions,
    monthlyNet,
    annualNet
  };
}

/**
 * 2. 주휴수당 & 알바 시급 계산기
 * @param {number} hourlyWage - 시급 (원)
 * @param {number} weeklyHours - 1주 총 근무시간 (시간)
 * @param {number} workDays - 1주 근무일수
 */
function calculateHourlyWage(hourlyWage, weeklyHours, workDays = 5) {
  // 주 15시간 이상 근무 시 주휴수당 발생
  const isEligibleForHolidayPay = weeklyHours >= 15;
  
  // 주휴시간 = (1주 소정근로시간 / 40) * 8 (최대 8시간)
  const holidayHours = isEligibleForHolidayPay ? Math.min(8, (weeklyHours / 40) * 8) : 0;
  
  // 주간 기본급
  const weeklyBasePay = weeklyHours * hourlyWage;
  // 주간 주휴수당
  const weeklyHolidayPay = holidayHours * hourlyWage;
  // 주간 총 급여
  const weeklyTotalPay = weeklyBasePay + weeklyHolidayPay;

  // 1개월 환산 (대한민국 근로기준법상 1달 평균 주수 = 365 / 7 / 12 = 약 4.345주)
  const monthlyAverageWeeks = 365 / 7 / 12;
  const monthlyTotalPay = Math.floor(weeklyTotalPay * monthlyAverageWeeks);
  const monthlyBasePay = Math.floor(weeklyBasePay * monthlyAverageWeeks);
  const monthlyHolidayPay = Math.floor(weeklyHolidayPay * monthlyAverageWeeks);

  // 주휴수당 포함 실질 시급
  const realHourlyWage = weeklyHours > 0 ? Math.floor(weeklyTotalPay / weeklyHours) : hourlyWage;

  return {
    hourlyWage,
    weeklyHours,
    workDays,
    isEligibleForHolidayPay,
    holidayHours: parseFloat(holidayHours.toFixed(1)),
    weeklyBasePay,
    weeklyHolidayPay,
    weeklyTotalPay,
    monthlyTotalPay,
    monthlyBasePay,
    monthlyHolidayPay,
    realHourlyWage
  };
}

/**
 * 3. 퇴직금 모의 계산기
 * 법정 산식: 1일 평균임금 x 30일 x (재직일수 / 365)
 */
function calculateSeverance(startDateStr, endDateStr, salary3Months, annualBonus = 0, annualLeavePay = 0) {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  const diffTime = end.getTime() - start.getTime();
  const totalWorkDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  if (totalWorkDays < 1) {
    return { error: '퇴사일은 입사일 이후여야 합니다.' };
  }

  const isEligible = totalWorkDays >= 365;

  // 최근 3개월 일수 (평균 92일 산정)
  const daysIn3Months = 92;

  // 3개월간 기본급 + 상여금 3/12 + 연차수당 3/12
  const bonusShare = (annualBonus * 3) / 12;
  const leaveShare = (annualLeavePay * 3) / 12;
  const total3MonthWages = salary3Months + bonusShare + leaveShare;

  // 1일 평균임금
  const dailyAverageWage = Math.floor(total3MonthWages / daysIn3Months);

  // 법정 퇴직금 = 1일 평균임금 x 30일 x (총재직일수 / 365)
  const estimatedSeverance = isEligible ? Math.floor(dailyAverageWage * 30 * (totalWorkDays / 365)) : 0;

  return {
    totalWorkDays,
    isEligible,
    daysIn3Months,
    dailyAverageWage,
    total3MonthWages,
    estimatedSeverance
  };
}

/**
 * 4. 실업급여 모의 계산기
 * 1일 구직급여 수급액 = 퇴직 전 3개월간 1일 평균임금의 60%
 * 상한액: 1일 66,000원 / 하한액: 1일 약 63,104원
 */
function calculateUnemployment(age, insuredMonths, monthlySalary, dailyWorkHours = 8) {
  // 1일 평균임금 산정 (월급 / 30일)
  const dailyWage = monthlySalary / 30;
  let dailyBenefit = dailyWage * 0.6;

  // 상한액 및 하한액 적용 (2026 기준)
  const maxDaily = 66000;
  // 최저임금 기준 하한액 (시간당 최저임금 * 0.8 * 일 소정근로시간)
  const minWagePerHour = 10030;
  const minDaily = Math.floor(minWagePerHour * 0.8 * Math.min(8, dailyWorkHours));

  if (dailyBenefit > maxDaily) dailyBenefit = maxDaily;
  if (dailyBenefit < minDaily) dailyBenefit = minDaily;

  // 연령 및 고용보험 가입기간별 소정급여일수 표
  let benefitDays = 0;
  const isOver50 = age >= 50;

  if (insuredMonths < 12) {
    benefitDays = 120;
  } else if (insuredMonths < 36) {
    benefitDays = isOver50 ? 180 : 150;
  } else if (insuredMonths < 60) {
    benefitDays = isOver50 ? 210 : 180;
  } else if (insuredMonths < 120) {
    benefitDays = isOver50 ? 240 : 210;
  } else {
    benefitDays = isOver50 ? 270 : 240;
  }

  const totalBenefit = Math.floor(dailyBenefit * benefitDays);

  return {
    dailyBenefit: Math.floor(dailyBenefit),
    benefitDays,
    totalBenefit,
    monthlyEstimated: Math.floor(dailyBenefit * 30)
  };
}

/**
 * 5. 부동산 중개보수(복비) 계산기
 * @param {string} propertyType - 'house' (주택), 'officetel' (오피스텔), 'other' (토지/상가)
 * @param {string} dealType - 'trade' (매매/교환), 'jeonse' (전세), 'monthly' (월세)
 * @param {number} dealAmount - 매매가 또는 전세보증금 (원)
 * @param {number} monthlyRent - 월세 (원)
 */
function calculateBrokerageFee(propertyType, dealType, dealAmount, monthlyRent = 0) {
  let transactionAmount = dealAmount;

  // 월세의 경우 거래금액 환산 (보증금 + 월세 * 100, 5천만원 미만 시 70)
  if (dealType === 'monthly') {
    let converted = dealAmount + (monthlyRent * 100);
    if (converted < 50000000) {
      converted = dealAmount + (monthlyRent * 70);
    }
    transactionAmount = converted;
  }

  let rate = 0;
  let maxLimit = 0;

  if (propertyType === 'house') {
    if (dealType === 'trade') {
      if (transactionAmount < 50000000) { rate = 0.006; maxLimit = 250000; }
      else if (transactionAmount < 200000000) { rate = 0.005; maxLimit = 800000; }
      else if (transactionAmount < 900000000) { rate = 0.004; maxLimit = 0; }
      else if (transactionAmount < 1200000000) { rate = 0.005; maxLimit = 0; }
      else if (transactionAmount < 1500000000) { rate = 0.006; maxLimit = 0; }
      else { rate = 0.007; maxLimit = 0; }
    } else {
      // 임대차 (전세/월세)
      if (transactionAmount < 50000000) { rate = 0.005; maxLimit = 200000; }
      else if (transactionAmount < 100000000) { rate = 0.004; maxLimit = 300000; }
      else if (transactionAmount < 900000000) { rate = 0.003; maxLimit = 0; }
      else if (transactionAmount < 1200000000) { rate = 0.004; maxLimit = 0; }
      else if (transactionAmount < 1500000000) { rate = 0.005; maxLimit = 0; }
      else { rate = 0.006; maxLimit = 0; }
    }
  } else if (propertyType === 'officetel') {
    // 주거용 오피스텔 (전용면적 85㎡ 이하)
    if (dealType === 'trade') rate = 0.005;
    else rate = 0.004;
  } else {
    // 토지 및 일반 상가 (상한 0.9% 협의)
    rate = 0.009;
  }

  let calculatedFee = Math.floor(transactionAmount * rate);
  if (maxLimit > 0 && calculatedFee > maxLimit) {
    calculatedFee = maxLimit;
  }

  const vat = Math.floor(calculatedFee * 0.1);
  const totalFeeWithVat = calculatedFee + vat;

  return {
    transactionAmount,
    ratePercentage: (rate * 100).toFixed(2),
    maxLimit,
    calculatedFee,
    vat,
    totalFeeWithVat
  };
}

/**
 * 6. 글자수 세기 & 바이트 분석
 */
function analyzeText(text) {
  if (!text) {
    return {
      withSpaces: 0,
      withoutSpaces: 0,
      bytesEucKr: 0,
      bytesUtf8: 0,
      words: 0,
      lines: 0,
      readingMinutes: 0
    };
  }

  const withSpaces = text.length;
  const withoutSpaces = text.replace(/\s/g, '').length;

  // EUC-KR 바이트 계산 (한글 2바이트, 영문/기호 1바이트)
  let bytesEucKr = 0;
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    bytesEucKr += (code > 127) ? 2 : 1;
  }

  // UTF-8 바이트 계산 (한글 3바이트)
  const bytesUtf8 = new TextEncoder().encode(text).length;

  // 단어수
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;

  // 줄 수
  const lines = text.split(/\r\n|\r|\n/).length;

  // 예상 읽기 시간 (분당 400자 기준)
  const readingMinutes = Math.max(1, Math.ceil(withSpaces / 400));

  return {
    withSpaces,
    withoutSpaces,
    bytesEucKr,
    bytesUtf8,
    words,
    lines,
    readingMinutes
  };
}
