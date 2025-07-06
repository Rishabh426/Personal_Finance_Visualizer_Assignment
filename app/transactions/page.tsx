"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TransactionForm } from "@/components/transaction-form"
import { TransactionList } from "@/components/transaction-list"
import { useTransactions } from "@/hooks/use-transaction"

interface TransactionFormData {
  amount: number
  description: string
  category: string
  date: Date
  type: "income" | "expense"
}

export default function TransactionsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { createTransaction } = useTransactions()

  const handleAddTransaction = async (data: TransactionFormData) => {
    try {
      await createTransaction(data)
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("Failed to create transaction:", error)
      // Error is handled in the hook
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">Manage all your income and expense transactions.</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Transaction</DialogTitle>
            </DialogHeader>
            <TransactionForm onSubmit={handleAddTransaction} onCancel={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <TransactionList />
    </div>
  )
}
