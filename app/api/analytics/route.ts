import type { NextRequest } from "next/server"
import connectDB from "@/lib/db"
import Transaction from "@/lib/models/transaction.model"
import { successResponse, handleApiError } from "@/lib/utils/api-response"

interface MonthlySummaryResult {
  _id: "income" | "expense"
  total: number
  count: number
}

interface CategoryBreakdownResult {
  _id: string
  total: number
  count: number
}

interface MonthlyTrendResult {
  _id: {
    year: number
    month: number
  }
  total: number
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const month = Number.parseInt(searchParams.get("month") || new Date().getMonth().toString()) + 1
    const year = Number.parseInt(searchParams.get("year") || new Date().getFullYear().toString())

    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59)

    // Monthly summary
    const monthlySummary = (await Transaction.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ])) as MonthlySummaryResult[]

    // Category breakdown
    const categoryBreakdown = (await Transaction.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
          type: "expense",
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { total: -1 },
      },
    ])) as CategoryBreakdownResult[]

    // Recent transactions
    const recentTransactions = await Transaction.find().sort({ date: -1 }).limit(5).lean()

    // Monthly expenses trend (last 6 months)
    const monthlyTrend = (await Transaction.aggregate([
      {
        $match: {
          type: "expense",
          date: {
            $gte: new Date(year, month - 7, 1),
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          total: { $sum: "$amount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ])) as MonthlyTrendResult[]

    const totalIncome = monthlySummary.find((item) => item._id === "income")?.total || 0
    const totalExpenses = monthlySummary.find((item) => item._id === "expense")?.total || 0

    return successResponse({
      summary: {
        totalIncome,
        totalExpenses,
        netIncome: totalIncome - totalExpenses,
        transactionCount: monthlySummary.reduce((acc, item) => acc + item.count, 0),
      },
      categoryBreakdown,
      recentTransactions,
      monthlyTrend: monthlyTrend.map((item) => ({
        month: `${item._id.year}-${item._id.month.toString().padStart(2, "0")}`,
        total: item.total,
      })),
    })
  } catch (error) {
    return handleApiError(error)
  }
}
