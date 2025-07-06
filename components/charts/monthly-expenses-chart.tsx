"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { analyticsApi } from "@/lib/api"

interface ChartData {
  month: string
  total: number
}

export function MonthlyExpensesChart() {
  const [data, setData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await analyticsApi.getDashboardData()

        // Add null checks and array validation
        if (result && result.monthlyTrend && Array.isArray(result.monthlyTrend)) {
          setData(result.monthlyTrend)
        } else {
          setError("No monthly trend data available")
          setData([])
        }
      } catch (err) {
        console.error("Monthly chart fetch error:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch chart data")
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Expenses</CardTitle>
          <CardDescription>Your spending trend over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Expenses</CardTitle>
          <CardDescription>Your spending trend over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">
            <p>Error loading chart data</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
        <CardDescription>Your spending trend over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                tickFormatter={(value: string) => {
                  const [year, month] = value.split("-")
                  const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1)
                  return date.toLocaleDateString("en-US", { month: "short" })
                }}
              />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(value: number) => `$${value}`} />
              <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
