// Get Dashboard Stats
export interface GetDashboardStatsResponse {
    success: boolean
    message: string
    data: GetDashboardStats
}

export interface GetDashboardStats {
    total_products: number
    total_stock_value: number
    low_stock_items: number
    total_quantity: number
}


// Get Dashboard Recent Stock Movements
export interface GetDashboardRecentStockMovementsResponse {
    success: boolean
    message: string
    data: GetDashboardRecentStockMovement[]
}

export interface GetDashboardRecentStockMovement {
    id: string
    product: Product
    user: User
    type: string
    quantity: string
    quantity_before: string
    quantity_after: string
    unit_cost: string
    reference_number: string
    notes: string
    occurred_at: string
    created_at: string
}

export interface Product {
    id: string
    name: string
    sku: string
    description: any
    reorder_level: any
    cost_price: any
    is_active: any
    created_at: any
}

export interface User {
    id: string
    name: string
    email: any
    role: any
    created_at: any
}

// Get Dashboard Top Categories
export interface GetDashboardTopCategoriesResponse {
    success: boolean
    message: string
    data: GetDashboardTopCategory[]
}

export interface GetDashboardTopCategory {
    id: string
    name: string
    product_count: number
    total_quantity: number
    total_value: number
}


export interface GetDashboardInventoryByCategoryResponse {
    success: boolean
    message: string
    data: GetDashboardInventoryByCategory[]
}

export interface GetDashboardInventoryByCategory {
    id: string
    name: string
    total_products: number
    active_products: number
    total_quantity: number
    total_value: number
    low_stock_count: number
}
