import type { NextRequest } from "next/server"
import connectDB from "@/lib/db"
import Budget from "@/lib/models/budget.model"
import { successResponse, errorResponse, handleApiError, ApiError } from "@/lib/utils/api-response"
import { UpdateBudgetSchema } from "@/lib/utils/validation"
import mongoose from "mongoose"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, context: RouteParams) {
  try {
    await connectDB()

    const { id } = await context.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError("Invalid budget ID", 400)
    }

    const budget = await Budget.findById(id)

    if (!budget) {
      throw new ApiError("Budget not found", 404)
    }

    return successResponse(budget)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(request: NextRequest, context: RouteParams) {
  try {
    await connectDB()

    const { id } = await context.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError("Invalid budget ID", 400)
    }

    const body: unknown = await request.json()
    const validatedData = UpdateBudgetSchema.parse(body)

    const budget = await Budget.findByIdAndUpdate(id, validatedData, {
      new: true,
      runValidators: true,
    })

    if (!budget) {
      throw new ApiError("Budget not found", 404)
    }

    return successResponse(budget, "Budget updated successfully")
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
      throw new ApiError("Invalid budget ID", 400)
    }

    const budget = await Budget.findByIdAndDelete(id)

    if (!budget) {
      throw new ApiError("Budget not found", 404)
    }

    return successResponse(null, "Budget deleted successfully")
  } catch (error) {
    return handleApiError(error)
  }
}
