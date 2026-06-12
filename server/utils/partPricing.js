const GRADE_MAP = {
  'Grade A': 'gradeA',
  'Grade B': 'gradeB',
  'Grade C': 'gradeC',
  'Grade D': 'gradeD',
};

export const getPriceForGrade = (part, qualityGrade) => {
  const key = GRADE_MAP[qualityGrade] || 'gradeA';
  return part.gradePrices?.[key] ?? part.price ?? 0;
};

export const calculateAssemblyTotal = (partsWithDetails) =>
  partsWithDetails.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
