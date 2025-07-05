import type { NextRequest } from "next/server"
import { successResponse, handleApiError } from "@/lib/utils/api-response"
import { PREDEFINED_CATEGORIES } from "@/lib/models/category.model"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") as "income" | "expense" | null

    let categories = PREDEFINED_CATEGORIES

    if (type) {
      categories = categories.filter((category) => category.type === type)
    }

    return successResponse(categories)
  } catch (error) {
    return handleApiError(error)
  }
}
