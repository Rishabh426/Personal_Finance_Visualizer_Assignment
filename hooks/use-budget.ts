"use client"

import { useState, useEffect } from "react"
import { budgetApi } from "@/lib/api"
import type { IBudget } from "@/lib/models/budget.model"

interface UseBudgetsParams {
  month?: number
  year?: number
}

interface BudgetCreateData {
  category: string
  amount: number
  month: number
  year: number
}

interface BudgetUpdateData {
  category?: string
  amount?: number
  month?: number
  year?: number
}

export function useBudgets(params?: UseBudgetsParams) {
  const [budgets, setBudgets] = useState<IBudget[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBudgets = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await budgetApi.getAll(params)
      setBudgets(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch budgets")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBudgets()
  }, [params?.month, params?.year])

  const createBudget = async (data: BudgetCreateData) => {
    try {
      await budgetApi.create(data)
      await fetchBudgets()
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to create budget")
    }
  }

  const updateBudget = async (id: string, data: BudgetUpdateData) => {
    try {
      await budgetApi.update(id, data)
      await fetchBudgets()
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to update budget")
    }
  }

  const deleteBudget = async (id: string) => {
    try {
      await budgetApi.delete(id)
      await fetchBudgets()
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to delete budget")
    }
  }

  return {
    budgets,
    loading,
    error,
    refetch: fetchBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
  }
}
