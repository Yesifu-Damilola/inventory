'use client'

import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Spinner } from '@/components/ui/spinner'

interface CategoryData {
  category: string
  quantity: number
  value: number
}

export function InventorySummary() {
  const [data, setData] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSummary = async () => {
    setLoading(true)
    setError(null)
    try {
      // Mock API endpoint - replace with actual API call
      // const response = await fetch('/api/v1/reports/inventory-summary', {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // })

      // Mock data for demonstration
      const mockData: CategoryData[] = [
        { category: 'Proteins', quantity: 250, value: 5200 },
        { category: 'Vegetables', quantity: 480, value: 1850 },
        { category: 'Grains', quantity: 320, value: 2100 },
        { category: 'Dairy', quantity: 150, value: 1200 },
        { category: 'Condiments', quantity: 200, value: 680 },
        { category: 'Beverages', quantity: 400, value: 2400 },
      ]

      setData(mockData)
    } catch (err) {
      setError('Failed to load inventory summary')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSummary()
  }, [])

  const totalQuantity = data.reduce((sum, item) => sum + item.quantity, 0)
  const totalValue = data.reduce((sum, item) => sum + item.value, 0)

  const COLORS = ['#8b5cf6', '#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']

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
          <h2 className="text-3xl font-bold text-foreground mb-2">Inventory Summary by Category</h2>
          <p className="text-muted-foreground">Overview of inventory levels across all categories</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchSummary}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total Quantity</p>
            <p className="text-4xl font-bold text-primary">{totalQuantity.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-2">Units across all categories</p>
          </div>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total Value</p>
            <p className="text-4xl font-bold text-accent">${totalValue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-2">Estimated inventory value</p>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quantity by Category */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Quantity Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey="category"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
              />
              <YAxis tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  color: 'var(--color-foreground)',
                }}
              />
              <Bar dataKey="quantity" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Value Distribution */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Value Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, value }) => `${category}: $${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `$${value.toLocaleString()}`}
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  color: 'var(--color-foreground)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Category Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Quantity</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Value</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Avg Price</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-border/50 hover:bg-primary/5 transition-colors"
                >
                  <td className="py-3 px-4 text-foreground">{item.category}</td>
                  <td className="py-3 px-4 text-right text-foreground">
                    {item.quantity.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-primary">
                    ${item.value.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-muted-foreground">
                    ${(item.value / item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
