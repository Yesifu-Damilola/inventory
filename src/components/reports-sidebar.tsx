'use client'

import { PieChart, TrendingUp, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ReportView = 'summary' | 'stock-value'

interface ReportsSidebarProps {
  currentReport: ReportView
  onSelectReport: (report: ReportView) => void
}

export function ReportsSidebar({ currentReport, onSelectReport }: ReportsSidebarProps) {
  const reports = [
    {
      id: 'summary' as const,
      label: 'Inventory Summary',
      description: 'By category breakdown',
      icon: PieChart,
    },
    {
      id: 'stock-value' as const,
      label: 'Stock Value Report',
      description: 'Total inventory value',
      icon: TrendingUp,
    },
  ]

  return (
    <aside className="w-64 border-r border-border bg-card/30 backdrop-blur-sm">
      <div className="p-6 space-y-8">
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Reports
          </h2>
          <nav className="space-y-2">
            {reports.map((report) => {
              const Icon = report.icon
              const isActive = currentReport === report.id
              return (
                <button
                  key={report.id}
                  onClick={() => onSelectReport(report.id)}
                  className={cn(
                    'w-full px-4 py-3 rounded-lg text-left transition-all duration-200',
                    isActive
                      ? 'bg-primary/20 border border-primary/30 shadow-lg shadow-primary/10'
                      : 'hover:bg-muted/50 border border-transparent'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Icon
                      className={cn(
                        'h-5 w-5 mt-0.5 flex-shrink-0 transition-colors',
                        isActive ? 'text-primary' : 'text-muted-foreground'
                      )}
                    />
                    <div className="min-w-0">
                      <p
                        className={cn(
                          'font-medium text-sm transition-colors',
                          isActive ? 'text-foreground' : 'text-muted-foreground'
                        )}
                      >
                        {report.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {report.description}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-border">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Admin
          </h3>
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
    </aside>
  )
}
