import { PencilIcon, TrashIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../context/AuthContext'
import Card from '../common/Card'
import Button from '../common/Button'

export default function PartCard({ part, onEdit, onDelete }) {
  const { user } = useAuth()
  const canManage = user?.role === 'admin' || user?.role === 'vendor'

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)

  return (
    <Card className="overflow-hidden p-0 flex flex-col">
      <div className="relative h-40 bg-app-muted rounded-t-xl overflow-hidden">
        {part.image?.url ? (
          <img
            src={part.image.url}
            alt={part.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <WrenchScrewdriverIcon className="w-16 h-16 text-app-text-muted" />
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-app-text text-base leading-tight">{part.name}</h3>
          <span className="shrink-0 bg-app-muted text-teal-500 dark:text-teal-400 text-xs px-2 py-1 rounded-full uppercase">
            {part.sku || part.category}
          </span>
        </div>

        {part.brand && (
          <p className="text-app-text-secondary text-sm">{part.brand}</p>
        )}

        {part.description && (
          <p className="text-app-text-secondary text-sm line-clamp-2">{part.description}</p>
        )}

        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-teal-500 dark:text-teal-400 font-bold text-base">
            {formatPrice(part.price)}
          </span>
          <span className="text-app-text-secondary text-sm">
            Stock: {part.stock ?? 0} {part.unit ?? 'pcs'}
          </span>
        </div>

        {canManage && (
          <div className="flex gap-2 pt-2 border-t border-app-border">
            <Button
              variant="secondary"
              size="sm"
              className="flex items-center gap-1.5 flex-1 justify-center"
              onClick={() => onEdit(part)}
            >
              <PencilIcon className="w-4 h-4" />
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              className="flex items-center gap-1.5 flex-1 justify-center"
              onClick={() => onDelete(part._id)}
            >
              <TrashIcon className="w-4 h-4" />
              Delete
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
