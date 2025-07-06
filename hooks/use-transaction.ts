"use client"

import { useState, useEffect } from "react"
import { transactionApi } from "@/lib/api"
import type { ITransaction } from "@/lib/models/transaction.model"

interface UseTransactionsParams {
  page?: number
  limit?: number
  category?: string
  type?: string
  startDate?: string
  endDate?: string
}

interface TransactionCreateData {
  amount: number
  description: string
  category: string
  date: Date
  type: "income" | "expense"
}

interface TransactionUpdateData {
  amount?: number
  description?: string
  category?: string
  date?: Date
  type?: "income" | "expense"
}

interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export function useTransactions(params?: UseTransactionsParams) {
  const [transactions, setTransactions] = useState<ITransaction[]>([])
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await transactionApi.getAll(params)
      setTransactions(data.transactions)
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch transactions")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [params?.page, params?.limit, params?.category, params?.type, params?.startDate, params?.endDate])

  const createTransaction = async (data: TransactionCreateData) => {
    try {
      await transactionApi.create(data)
      await fetchTransactions() // Refresh the list
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to create transaction")
    }
  }

  const updateTransaction = async (id: string, data: TransactionUpdateData) => {
    try {
      await transactionApi.update(id, data)
      await fetchTransactions() // Refresh the list
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to update transaction")
    }
  }

  const deleteTransaction = async (id: string) => {
    try {
      await transactionApi.delete(id)
      await fetchTransactions() // Refresh the list
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to delete transaction")
    }
  }

  return {
    transactions,
    pagination,
    loading,
    error,
    refetch: fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  }
}
