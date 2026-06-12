export const PART_CATEGORIES = [
  { value: 'spring', label: 'Spring' },
  { value: 'seal', label: 'Seal' },
  { value: 'damper', label: 'Damper' },
  { value: 'valve', label: 'Valve' },
  { value: 'suspension', label: 'Suspension' },
  { value: 'brakes', label: 'Brakes' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'other', label: 'Other' },
]

export const PART_CATEGORY_FILTER = [{ value: '', label: 'All Categories' }, ...PART_CATEGORIES]

export const EMPTY_PART_FORM = {
  name: '',
  sku: '',
  category: 'spring',
  brand: '',
  price: '',
  gradeA: '',
  gradeB: '',
  gradeC: '',
  gradeD: '',
  description: '',
  unit: 'piece',
  modelCompatibility: '',
}

export const BIKE_CATEGORIES = [
  { value: '70cc', label: '70cc' },
  { value: '125cc', label: '125cc' },
  { value: '150cc', label: '150cc' },
  { value: 'Other', label: 'Other' },
]

export const QUALITY_GRADES = [
  { value: 'Grade A', label: 'Grade A — Premium / Kabli' },
  { value: 'Grade B', label: 'Grade B — Standard' },
  { value: 'Grade C', label: 'Grade C — Second-Hand' },
  { value: 'Grade D', label: 'Grade D — Budget / Local' },
]

export const JUMP_STATUSES = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Ready', label: 'Ready' },
]
