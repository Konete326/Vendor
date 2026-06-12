const GRADE_MAP = {
  'Grade A': 'gradeA',
  'Grade B': 'gradeB',
  'Grade C': 'gradeC',
  'Grade D': 'gradeD',
}

export const getPartGradePrice = (part, grade = 'Grade B') => {
  const key = GRADE_MAP[grade]
  return part?.gradePrices?.[key] ?? part?.price ?? 0
}
