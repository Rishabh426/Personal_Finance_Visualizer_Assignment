"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progres"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useBudgets } from "@/hooks/use-budget"
import { BudgetForm } from "@/components/budget-form"

interface BudgetFormData {
  category: string
  amount: number
}

interface BudgetStatus {
  status: "exceeded" | "warning" | "good"
  color: string
}

export default function BudgetsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()

  const { budgets, loading, error, createBudget } = useBudgets({
    month: currentMonth,
    year: currentYear,
  })

  const handleAddBudget = async (data: BudgetFormData) => {
    try {
      await createBudget({
        ...data,
        month: currentMonth,
        year: currentYear,
      })
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("Failed to create budget:", error)
      // Error is handled in the hook
    }
  }

  const getBudgetStatus = (spent: number, amount: number): BudgetStatus => {
    const percentage = (spent / amount) * 100
    if (percentage >= 100) return { status: "exceeded", color: "bg-red-500" }
    if (percentage >= 80) return { status: "warning", color: "bg-yellow-500" }
    return { status: "good", color: "bg-green-500" }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p>Error loading budgets: {error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
          <p className="text-muted-foreground">
            Manage your monthly budgets for{" "}
            {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Budget
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Budget</DialogTitle>
            </DialogHeader>
            <BudgetForm onSubmit={handleAddBudget} onCancel={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {budgets.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8 text-muted-foreground">
              <p>No budgets set for this month</p>
              <p className="text-sm">Create your first budget to start tracking your spending</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {budgets.map((budget) => {
            const budgetStatus = getBudgetStatus(budget.spent, budget.amount)
            const percentage = Math.min((budget.spent / budget.amount) * 100, 100)
            const remaining = Math.max(0, budget.amount - budget.spent)

            return (
              <Card key={budget._id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="capitalize">{budget.category}</span>
                    <Badge variant={budgetStatus.status === "exceeded" ? "destructive" : "secondary"}>
                      {budgetStatus.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>Monthly budget tracking</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Spent</span>
                      <span className="font-medium">${budget.spent.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Budget</span>
                      <span className="font-medium">${budget.amount.toFixed(2)}</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{percentage.toFixed(1)}% used</span>
                      <span>${remaining.toFixed(2)} remaining</span>
                    </div>
                  </div>

                  {budgetStatus.status === "exceeded" && (
                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      ⚠️ Budget exceeded by ${(budget.spent - budget.amount).toFixed(2)}
                    </div>
                  )}

                  {budgetStatus.status === "warning" && (
                    <div className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">⚠️ Approaching budget limit</div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
