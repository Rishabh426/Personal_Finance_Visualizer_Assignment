import type { NextRequest } from "next/server"
import connectDB from "@/lib/db"
import Budget from "@/lib/models/budget.model"
import Transaction from "@/lib/models/transaction.model"
import { successResponse, errorResponse, handleApiError } from "@/lib/utils/api-response"
import { BudgetSchema } from "@/lib/utils/validation"

interface BudgetQuery {
  month?: number
  year?: number
}

interface AggregationResult {
  _id: null
  total: number
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const month = searchParams.get("month")
    const year = searchParams.get("year")

    const query: BudgetQuery = {}
    if (month) query.month = Number.parseInt(month)
    if (year) query.year = Number.parseInt(year)

    const budgets = await Budget.find(query).sort({ category: 1 })

    // Calculate actual spending for each budget
    const budgetsWithSpending = await Promise.all(
      budgets.map(async (budget) => {
        const startDate = new Date(budget.year, budget.month - 1, 1)
        const endDate = new Date(budget.year, budget.month, 0, 23, 59, 59)

        const totalSpent = (await Transaction.aggregate([
          {
            $match: {
              category: budget.category,
              type: "expense",
              date: { $gte: startDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" },
            },
          },
        ])) as AggregationResult[]

        const spent = totalSpent[0]?.total || 0

        // Update the budget with actual spending
        await Budget.findByIdAndUpdate(budget._id, { spent })

        return {
          ...budget.toObject(),
          spent,
          remaining: Math.max(0, budget.amount - spent),
          percentage: budget.amount > 0 ? (spent / budget.amount) * 100 : 0,
        }
      }),
    )

    return successResponse(budgetsWithSpending)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body: unknown = await request.json()
    const validatedData = BudgetSchema.parse(body)

    const budget = await Budget.create(validatedData)

    return successResponse(budget, "Budget created successfully", 201)
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return errorResponse("Validation failed", 400)
    }
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return errorResponse("Budget for this category and month already exists", 409)
    }
    return handleApiError(error)
  }
}
