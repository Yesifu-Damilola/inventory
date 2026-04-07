import { BarChart3, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Inventory Reports</h1>
            <p className="text-sm text-muted-foreground">Restaurant Management System</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  )
}
