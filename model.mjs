export const sampleWeeks = [
  { week: 'W01', records: 37, completed: 21 },
  { week: 'W02', records: 44, completed: 26 },
  { week: 'W03', records: 39, completed: 24 },
  { week: 'W04', records: 51, completed: 35 },
  { week: 'W05', records: 48, completed: 32 },
  { week: 'W06', records: 55, completed: 39 },
  { week: 'W07', records: 49, completed: 35 },
  { week: 'W08', records: 58, completed: 42 },
  { week: 'W09', records: 60, completed: 46 },
  { week: 'W10', records: 57, completed: 43 },
  { week: 'W11', records: 65, completed: 50 },
  { week: 'W12', records: 68, completed: 55 },
];

export function summarizeWeeks(weeks) {
  const records = weeks.reduce((total, week) => total + week.records, 0);
  const completed = weeks.reduce((total, week) => total + week.completed, 0);
  return { records, completed, rate: records ? completed / records : 0 };
}

export function impactStatement(scope = {}, impact = {}) {
  const show = (value) => value || '[To be completed]';
  const hasNumbers = scope.baseline !== undefined && scope.baseline !== ''
    && scope.target !== undefined && scope.target !== '';
  const baseline = Number(scope.baseline);
  const target = Number(scope.target);
  const change = target - baseline;
  const number = new Intl.NumberFormat('en-US', { maximumSignificantDigits: 12 });
  const outcome = hasNumbers && Number.isFinite(change)
    ? `${number.format(baseline)} → ${number.format(target)} ${scope.unit}\n\nTarget change: ${change > 0 ? '+' : ''}${number.format(change)} ${scope.unit}`
    : '[Save finite baseline and target values in the scope]';

  return [
    '# Impact Statement',
    `## Who benefits\n${show(scope.persona)}\n\nStrategic pillar: ${show(scope.pillar)}\n\nProblem: ${show(scope.problem)}`,
    `## Prototype\n${show(impact.solution)}`,
    `## Measurable outcome\nMetric: ${show(scope.metric)}\n\n${outcome}\n\nMeasurement plan: ${show(impact.measurement)}`,
    `## Statewide rollout\n${show(impact.rollout)}`,
    `## Top risk and mitigation\n${show(impact.risk)}`,
  ].join('\n\n') + '\n';
}
