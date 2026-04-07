'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  className?: string
  actions?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'destructive' | 'outline'
  }[]
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  actions = [],
}: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={cn(
          'bg-card rounded-lg border border-border shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto',
          className,
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-accent/10 rounded transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {children}
        </div>

        {actions.length > 0 && (
          <div className="border-t border-border p-6 flex gap-2 justify-end">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'default'}
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
