"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { analyticsApi } from "@/lib/api"
import { PREDEFINED_CATEGORIES } from "@/lib/models/category.model"

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#AED6F1",
]

interface ChartDataItem {
  name: string
  value: number
  color: string
}

interface PieLabelProps {
  name?: string
  percent?: number
}

export function CategoryPieChart() {
  const [data, setData] = useState<ChartDataItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await analyticsApi.getDashboardData()

        // Add null checks and array validation
        if (result && result.categoryBreakdown && Array.isArray(result.categoryBreakdown)) {
          const chartData: ChartDataItem[] = result.categoryBreakdown.map((item, index) => {
            const category = PREDEFINED_CATEGORIES.find((cat) => cat.id === item._id)
            return {
              name: category?.name || item._id,
              value: item.total,
              color: category?.color || COLORS[index % COLORS.length],
            }
          })

          setData(chartData)
        } else {
          setError("No category data available")
          setData([])
        }
      } catch (err) {
        console.error("Category chart fetch error:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch chart data")
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const renderCustomLabel = ({ name, percent }: PieLabelProps) => {
    if (!name || percent === undefined) return ""
    return `${name} ${(percent * 100).toFixed(0)}%`
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expenses by Category</CardTitle>
          <CardDescription>Breakdown of your spending by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expenses by Category</CardTitle>
          <CardDescription>Breakdown of your spending by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>{error || "No expense data available"}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
        <CardDescription>Breakdown of your spending by category</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={data.reduce(
            (acc, item) => ({
              ...acc,
              [item.name]: {
                label: item.name,
                color: item.color,
              },
            }),
            {},
          )}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number) => [`$${value.toFixed(2)}`, "Amount"]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
