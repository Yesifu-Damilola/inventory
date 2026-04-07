'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Column<T> {
  key: keyof T
  label: string
  render?: (value: any, row: T) => React.ReactNode
  sortable?: boolean
  width?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  searchPlaceholder?: string
  searchKey?: keyof T
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  isLoading = false,
  onEdit,
  onDelete,
  searchPlaceholder = 'Search...',
  searchKey,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortKey, setSortKey] = useState<keyof T | null>(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  let filteredData = data
  if (searchTerm && searchKey) {
    filteredData = data.filter((item) =>
      String(item[searchKey]).toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  if (sortKey) {
    filteredData = [...filteredData].sort((a, b) => {
      const aValue = a[sortKey]
      const bValue = b[sortKey]
      const comparison = String(aValue).localeCompare(String(bValue))
      return sortOrder === 'asc' ? comparison : -comparison
    })
  }

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
    setCurrentPage(1)
  }

  return (
    <div className="space-y-4">
      {searchKey && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-10"
          />
        </div>
      )}

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    'px-4 py-3 text-left text-sm font-semibold text-foreground',
                    column.width && `w-${column.width}`
                  )}
                >
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      {column.label}
                      {sortKey === column.key && (
                        <span className="text-xs">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="text-center py-8">
                  <p className="text-muted-foreground">Loading...</p>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="text-center py-8">
                  <p className="text-muted-foreground">No data found</p>
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr key={item.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  {columns.map((column) => (
                    <td key={String(column.key)} className="px-4 py-3 text-sm">
                      {column.render
                        ? column.render(item[column.key], item)
                        : String(item[column.key])}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        {onEdit && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEdit(item)}
                          >
                            Edit
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => onDelete(item)}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filteredData.length > itemsPerPage && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of{' '}
            {filteredData.length} items
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                size="sm"
                variant={currentPage === page ? 'default' : 'outline'}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
