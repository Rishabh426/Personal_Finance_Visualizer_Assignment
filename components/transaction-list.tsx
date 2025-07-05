"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { TransactionForm } from "@/components/transaction-form"
import { useTransactions } from "@/hooks/use-transaction"
import { useToast } from "@/hooks/use-toast"
import type { ITransaction } from "@/lib/models/transaction.model"

// Add this type definition
type TransactionFormData = {
  amount: number
  description: string
  category: string
  date: Date
  type: "income" | "expense"
}
import { PREDEFINED_CATEGORIES } from "@/lib/models/category.model"

interface TransactionListProps {
  initialPage?: number
}

export function TransactionList({ initialPage = 1 }: TransactionListProps) {
  const [page, setPage] = useState(initialPage)
  const [filters, setFilters] = useState({
    category: "",
    type: "",
    search: "",
  })
  const [editingTransaction, setEditingTransaction] = useState<ITransaction | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const { toast } = useToast()
  const { transactions, pagination, loading, error, updateTransaction, deleteTransaction } = useTransactions({
    page,
    limit: 10,
    category: filters.category || undefined,
    type: filters.type || undefined,
  })

  const getCategoryInfo = (categoryId: string) => {
    return (
      PREDEFINED_CATEGORIES.find((cat) => cat.id === categoryId) || {
        name: categoryId,
        icon: "📦",
        color: "#gray",
      }
    )
  }

  const handleEdit = (transaction: ITransaction) => {
    setEditingTransaction(transaction)
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = async (data: TransactionFormData) => {
    if (!editingTransaction) return

    try {
      await updateTransaction(editingTransaction._id, data)
      setIsEditDialogOpen(false)
      setEditingTransaction(null)
    } catch (error) {
      console.error("Failed to update transaction:", error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id)
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete transaction",
        variant: "destructive",
      })
    }
  }

  const filteredTransactions = transactions.filter((transaction) => {
    if (filters.search) {
      return transaction.description.toLowerCase().includes(filters.search.toLowerCase())
    }
    return true
  })

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Error loading transactions: {error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Recent Transactions</span>
          <Badge variant="secondary">{pagination.total} total</Badge>
        </CardTitle>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            />
          </div>
          <Select value={filters.type} onValueChange={(value) => setFilters((prev) => ({ ...prev, type: value }))}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.category}
            onValueChange={(value) => setFilters((prev) => ({ ...prev, category: value }))}
          >
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {PREDEFINED_CATEGORIES.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No transactions found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => {
              const categoryInfo = getCategoryInfo(transaction.category)
              return (
                <div
                  key={transaction._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">{categoryInfo.icon}</div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{categoryInfo.name}</span>
                        <span>•</span>
                        <span>{format(new Date(transaction.date), "MMM dd, yyyy")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p
                        className={`font-semibold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
                      >
                        {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                      </p>
                      <Badge variant={transaction.type === "income" ? "default" : "secondary"}>
                        {transaction.type}
                      </Badge>
                    </div>

                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(transaction)}>
                        <Edit className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this transaction? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(transaction._id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} transactions
            </p>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={!pagination.hasPrev}>
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={!pagination.hasNext}>
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          {editingTransaction && (
            <TransactionForm
              transaction={editingTransaction}
              onSubmit={handleEditSubmit}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
