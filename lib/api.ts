import type { ITransaction } from "./models/transaction.model"
import type { IBudget } from "./models/budget.model"
import type { ICategory } from "./models/category.model"

const API_BASE = "/api"

// API Response Types
interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

interface PaginatedResponse<T> {
  transactions: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Transaction API
export const transactionApi = {
  async getAll(params?: {
    page?: number
    limit?: number
    category?: string
    type?: string
    startDate?: string
    endDate?: string
  }): Promise<PaginatedResponse<ITransaction>> {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value.toString())
      })
    }

    const response = await fetch(`${API_BASE}/transactions?${searchParams}`)
    const result: ApiResponse<PaginatedResponse<ITransaction>> = await response.json()

    if (!result.success) throw new Error(result.error)
    return result.data!
  },

  async getById(id: string): Promise<ITransaction> {
    const response = await fetch(`${API_BASE}/transactions/${id}`)
    const result: ApiResponse<ITransaction> = await response.json()

    if (!result.success) throw new Error(result.error)
    return result.data!
  },

  async create(data: Omit<ITransaction, "_id" | "createdAt" | "updatedAt">): Promise<ITransaction> {
    const response = await fetch(`${API_BASE}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const result: ApiResponse<ITransaction> = await response.json()

    if (!result.success) throw new Error(result.error)
    return result.data!
  },

  async update(id: string, data: Partial<ITransaction>): Promise<ITransaction> {
    const response = await fetch(`${API_BASE}/transactions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const result: ApiResponse<ITransaction> = await response.json()

    if (!result.success) throw new Error(result.error)
    return result.data!
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/transactions/${id}`, {
      method: "DELETE",
    })
    const result: ApiResponse<null> = await response.json()

    if (!result.success) throw new Error(result.error)
  },
}

// Budget API
export const budgetApi = {
  async getAll(params?: { month?: number; year?: number }): Promise<IBudget[]> {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value.toString())
      })
    }

    const response = await fetch(`${API_BASE}/budgets?${searchParams}`)
    const result: ApiResponse<IBudget[]> = await response.json()

    if (!result.success) throw new Error(result.error)
    return result.data!
  },

  async create(data: Omit<IBudget, "_id" | "spent" | "createdAt" | "updatedAt">): Promise<IBudget> {
    const response = await fetch(`${API_BASE}/budgets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const result: ApiResponse<IBudget> = await response.json()

    if (!result.success) throw new Error(result.error)
    return result.data!
  },

  async update(id: string, data: Partial<IBudget>): Promise<IBudget> {
    const response = await fetch(`${API_BASE}/budgets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const result: ApiResponse<IBudget> = await response.json()

    if (!result.success) throw new Error(result.error)
    return result.data!
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/budgets/${id}`, {
      method: "DELETE",
    })
    const result: ApiResponse<null> = await response.json()

    if (!result.success) throw new Error(result.error)
  },
}

// Category API
export const categoryApi = {
  async getAll(type?: "income" | "expense"): Promise<ICategory[]> {
    const searchParams = new URLSearchParams()
    if (type) searchParams.append("type", type)

    const response = await fetch(`${API_BASE}/categories?${searchParams}`)
    const result: ApiResponse<ICategory[]> = await response.json()

    if (!result.success) throw new Error(result.error)
    return result.data!
  },
}

// Analytics API
export const analyticsApi = {
  async getDashboardData(
    month?: number,
    year?: number,
  ): Promise<{
    summary: {
      totalIncome: number
      totalExpenses: number
      netIncome: number
      transactionCount: number
    }
    categoryBreakdown: Array<{ _id: string; total: number; count: number }>
    recentTransactions: ITransaction[]
    monthlyTrend: Array<{ month: string; total: number }>
  }> {
    const searchParams = new URLSearchParams()
    if (month) searchParams.append("month", month.toString())
    if (year) searchParams.append("year", year.toString())

    const response = await fetch(`${API_BASE}/analytics?${searchParams}`)
    const result = await response.json()

    if (!result.success) throw new Error(result.error)
    return result.data!
  },
}
