'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, RefreshCw, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Spinner } from '@/components/ui/spinner'

interface StockValueData {
  date: string
  total_value: number
  purchase_value: number
  consumption_value: number
}

interface CategoryValue {
  category: string
  value: number
  percentage: number
}

export function StockValueReport() {
  const [timeline, setTimeline] = useState<StockValueData[]>([])
  const [byCategory, setByCategory] = useState<CategoryValue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStockValue = async () => {
    setLoading(true)
    setError(null)
    try {
      // Mock API endpoint - replace with actual API call
      // const response = await fetch('/api/v1/reports/stock-value', {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // })

      // Mock timeline data
      const mockTimeline: StockValueData[] = [
        { date: 'Jan 1', total_value: 12500, purchase_value: 8200, consumption_value: 3100 },
        { date: 'Jan 8', total_value: 13200, purchase_value: 8900, consumption_value: 3200 },
        { date: 'Jan 15', total_value: 12800, purchase_value: 8400, consumption_value: 3400 },
        { date: 'Jan 22', total_value: 14100, purchase_value: 9300, consumption_value: 3600 },
        { date: 'Jan 29', total_value: 13600, purchase_value: 8800, consumption_value: 3500 },
        { date: 'Feb 5', total_value: 15200, purchase_value: 10100, consumption_value: 3800 },
      ]

      // Mock category breakdown
      const mockByCategory: CategoryValue[] = [
        { category: 'Proteins', value: 5200, percentage: 34.2 },
        { category: 'Beverages', value: 2400, percentage: 15.8 },
        { category: 'Vegetables', value: 1850, percentage: 12.2 },
        { category: 'Grains', value: 2100, percentage: 13.8 },
        { category: 'Dairy', value: 1200, percentage: 7.9 },
        { category: 'Condiments', value: 680, percentage: 4.5 },
      ]

      setTimeline(mockTimeline)
      setByCategory(mockByCategory)
    } catch (err) {
      setError('Failed to load stock value report')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStockValue()
  }, [])

  const currentValue = timeline[timeline.length - 1]?.total_value || 0
  const previousValue = timeline[timeline.length - 2]?.total_value || currentValue
  const change = currentValue - previousValue
  const changePercent = previousValue > 0 ? ((change / previousValue) * 100).toFixed(1) : '0'

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Total Stock Value Report</h2>
          <p className="text-muted-foreground">Comprehensive inventory valuation analysis</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchStockValue}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Current Total Value</p>
            <p className="text-4xl font-bold text-primary">${currentValue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-2">Inventory value as of today</p>
          </div>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Change from Last Week</p>
            <div className="flex items-baseline gap-2">
              <p className={`text-3xl font-bold ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {change >= 0 ? '+' : ''}{change.toLocaleString()}
              </p>
              <p className={`text-lg font-semibold ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ({changePercent}%)
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">7-day comparison</p>
          </div>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-accent" />
              <p className="text-sm font-medium text-muted-foreground">Avg Daily Movement</p>
            </div>
            <p className="text-3xl font-bold text-accent">${(change / 7).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-2">Value change per day</p>
          </div>
        </Card>
      </div>

      {/* Timeline Chart */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Value Trend Over Time
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={timeline}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="date"
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
            />
            <YAxis
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value) => `$${(value as number).toLocaleString()}`}
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                color: 'var(--color-foreground)',
              }}
            />
            <Area
              type="monotone"
              dataKey="total_value"
              stroke="var(--color-primary)"
              fillOpacity={1}
              fill="url(#colorTotal)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Movement Details */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Purchase vs Consumption</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={timeline}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="date"
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
            />
            <YAxis
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value) => `$${(value as number).toLocaleString()}`}
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                color: 'var(--color-foreground)',
              }}
            />
            <Legend
              wrapperStyle={{ color: 'var(--color-muted-foreground)' }}
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
              }}
            />
            <Bar
              dataKey="purchase_value"
              fill="var(--color-chart-2)"
              radius={[8, 8, 0, 0]}
              name="Purchases"
            />
            <Bar
              dataKey="consumption_value"
              fill="var(--color-chart-4)"
              radius={[8, 8, 0, 0]}
              name="Consumption"
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Category Breakdown */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Value by Category</h3>
        <div className="space-y-4">
          {byCategory.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{item.category}</span>
                <span className="text-sm font-semibold text-primary">
                  ${item.value.toLocaleString()} ({item.percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
