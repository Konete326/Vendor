import { EMPTY_PART_FORM } from './partConstants'

export const partToForm = (part) => {
  if (!part) return { ...EMPTY_PART_FORM }
  return {
    name: part.name ?? '',
    sku: part.sku ?? '',
    category: part.category ?? 'spring',
    brand: part.brand ?? '',
    price: part.price ?? '',
    gradeA: part.gradePrices?.gradeA ?? '',
    gradeB: part.gradePrices?.gradeB ?? '',
    gradeC: part.gradePrices?.gradeC ?? '',
    gradeD: part.gradePrices?.gradeD ?? '',
    description: part.description ?? '',
    unit: part.unit ?? 'piece',
    modelCompatibility: Array.isArray(part.modelCompatibility)
      ? part.modelCompatibility.join(', ')
      : part.modelCompatibility ?? '',
  }
}

export const buildPartFormData = (form, image) => {
  const fd = new FormData()
  Object.entries(form).forEach(([key, value]) => {
    if (['gradeA', 'gradeB', 'gradeC', 'gradeD'].includes(key)) return
    fd.append(key, value)
  })
  fd.append('gradePrices', JSON.stringify({
    gradeA: Number(form.gradeA) || Number(form.price) || 0,
    gradeB: Number(form.gradeB) || Number(form.price) || 0,
    gradeC: Number(form.gradeC) || Number(form.price) || 0,
    gradeD: Number(form.gradeD) || Number(form.price) || 0,
  }))
  if (image) fd.append('image', image)
  return fd
}
