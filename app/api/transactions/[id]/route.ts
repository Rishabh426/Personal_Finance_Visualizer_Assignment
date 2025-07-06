import type { NextRequest } from "next/server"
import connectDB from "@/lib/db"
import Transaction from "@/lib/models/transaction.model"
import { successResponse, errorResponse, handleApiError, ApiError } from "@/lib/utils/api-response"
import { UpdateTransactionSchema } from "@/lib/utils/validation"
import mongoose from "mongoose"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, context: RouteParams) {
  try {
    await connectDB()

    const { id } = await context.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError("Invalid transaction ID", 400)
    }

    const transaction = await Transaction.findById(id)

    if (!transaction) {
      throw new ApiError("Transaction not found", 404)
    }

    return successResponse(transaction)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(request: NextRequest, context: RouteParams) {
  try {
    await connectDB()

    const { id } = await context.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError("Invalid transaction ID", 400)
    }

    const body: unknown = await request.json()
    const validatedData = UpdateTransactionSchema.parse(body)

    const transaction = await Transaction.findByIdAndUpdate(id, validatedData, {
      new: true,
      runValidators: true,
    })

    if (!transaction) {
      throw new ApiError("Transaction not found", 404)
    }

    return successResponse(transaction, "Transaction updated successfully")
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return errorResponse("Validation failed", 400)
    }
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest, context: RouteParams) {
  try {
    await connectDB()

    const { id } = await context.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError("Invalid transaction ID", 400)
    }

    const transaction = await Transaction.findByIdAndDelete(id)

    if (!transaction) {
      throw new ApiError("Transaction not found", 404)
    }

    return successResponse(null, "Transaction deleted successfully")
  } catch (error) {
    return handleApiError(error)
  }
}
