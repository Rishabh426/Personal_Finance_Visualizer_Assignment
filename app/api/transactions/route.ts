import type { NextRequest } from "next/server"
import { successResponse, errorResponse, handleApiError } from "@/lib/utils/api-response"
import { TransactionSchema } from "@/lib/utils/validation"

interface TransactionQuery {
  category?: string
  type?: string
  date?: {
    $gte?: Date
    $lte?: Date
  }
}

export async function GET(request: NextRequest) {
  try {
    // Dynamically import to avoid build-time execution
    const connectDB = (await import("@/lib/db")).default
    const Transaction = (await import("@/lib/models/transaction.model")).default

    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category")
    const type = searchParams.get("type")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // Build query
    const query: TransactionQuery = {}

    if (category) query.category = category
    if (type) query.type = type as "income" | "expense"
    if (startDate || endDate) {
      query.date = {}
      if (startDate) query.date.$gte = new Date(startDate)
      if (endDate) query.date.$lte = new Date(endDate)
    }

    // Execute query with pagination
    const skip = (page - 1) * limit
    const [transactions, total] = await Promise.all([
      Transaction.find(query).sort({ date: -1 }).skip(skip).limit(limit).lean(),
      Transaction.countDocuments(query),
    ])

    const totalPages = Math.ceil(total / limit)

    return successResponse({
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    // Dynamically import to avoid build-time execution
    const connectDB = (await import("@/lib/db")).default
    const Transaction = (await import("@/lib/models/transaction.model")).default

    await connectDB()

    const body: unknown = await request.json()
    const validatedData = TransactionSchema.parse(body)

    const transaction = await Transaction.create(validatedData)

    return successResponse(transaction, "Transaction created successfully", 201)
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return errorResponse("Validation failed", 400)
    }
    return handleApiError(error)
  }
}
