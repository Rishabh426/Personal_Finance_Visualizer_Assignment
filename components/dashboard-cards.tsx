"use client"

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown, DollarSign, CreditCard } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { analyticsApi } from "@/lib/api"

interface DashboardData {
  summary: {
    totalIncome: number
    totalExpenses: number
    netIncome: number
    transactionCount: number
  }
}

export function DashboardCards() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await analyticsApi.getDashboardData()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex justify-center">
                <LoadingSpinner />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">Error loading dashboard data</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const cards = [
    {
      title: "Total Income",
      value: data.summary.totalIncome,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Expenses",
      value: data.summary.totalExpenses,
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Net Income",
      value: data.summary.netIncome,
      icon: DollarSign,
      color: data.summary.netIncome >= 0 ? "text-green-600" : "text-red-600",
      bgColor: data.summary.netIncome >= 0 ? "bg-green-100" : "bg-red-100",
    },
    {
      title: "Transactions",
      value: data.summary.transactionCount,
      icon: CreditCard,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      isCount: true,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className={`p-2 rounded-full ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.color}`}>
                {card.isCount ? card.value.toLocaleString() : `$${card.value.toFixed(2)}`}
              </div>
              <p className="text-xs text-muted-foreground">
                {card.title === "Net Income"
                  ? card.value >= 0
                    ? "Positive cash flow"
                    : "Negative cash flow"
                  : "This month"}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
