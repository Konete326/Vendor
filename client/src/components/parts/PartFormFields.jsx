import Input from '../common/Input'
import { PART_CATEGORIES } from '../../utils/partConstants'

export default function PartFormFields({ form, onChange, image, onImageChange, existingImageUrl }) {
  return (
    <div className="space-y-4">
      <Input label="Name" name="name" value={form.name} onChange={onChange} required />
      <Input label="SKU" name="sku" value={form.sku} onChange={onChange} required placeholder="Unique part code" />

      <Input
        label="Category"
        name="category"
        type="select"
        value={form.category}
        onChange={onChange}
        options={PART_CATEGORIES}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Brand" name="brand" value={form.brand} onChange={onChange} required />
        <Input label="Base Price" name="price" type="number" min="0" step="0.01" value={form.price} onChange={onChange} required />
      </div>

      <div>
        <p className="text-sm font-medium text-app-text-secondary mb-2">Grade Prices (optional)</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Input label="Grade A" name="gradeA" type="number" min="0" step="0.01" value={form.gradeA} onChange={onChange} />
          <Input label="Grade B" name="gradeB" type="number" min="0" step="0.01" value={form.gradeB} onChange={onChange} />
          <Input label="Grade C" name="gradeC" type="number" min="0" step="0.01" value={form.gradeC} onChange={onChange} />
          <Input label="Grade D" name="gradeD" type="number" min="0" step="0.01" value={form.gradeD} onChange={onChange} />
        </div>
      </div>

      <div className="w-full">
        <label className="block text-sm font-medium text-app-text-secondary mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          rows={3}
          className="w-full bg-app-muted border border-app-input-border text-app-text rounded-lg px-3 py-2 focus:outline-none focus:border-teal-400 transition-colors resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Unit" name="unit" value={form.unit} onChange={onChange} />
        <Input
          label="Model Compatibility (comma-separated)"
          name="modelCompatibility"
          value={form.modelCompatibility}
          onChange={onChange}
        />
      </div>

      <div className="w-full">
        <label className="block text-sm font-medium text-app-text-secondary mb-1">Image</label>
        {existingImageUrl && !image && (
          <img src={existingImageUrl} alt="Current" className="h-20 w-20 object-cover rounded-lg mb-2 border border-app-border" />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onImageChange(e.target.files[0])}
          className="w-full text-app-text-secondary text-sm file:mr-4 file:py-2 file:px-4 file:bg-teal-500 file:text-white file:border-0 file:rounded-lg file:cursor-pointer hover:file:bg-teal-600 file:transition-colors"
        />
      </div>
    </div>
  )
}
