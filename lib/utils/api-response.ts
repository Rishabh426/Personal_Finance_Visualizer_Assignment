import { NextResponse } from "next/server"

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export class ApiError extends Error {
  statusCode: number

  constructor(message: string, statusCode = 500) {
    super(message)
    this.statusCode = statusCode
    this.name = "ApiError"
  }
}

export function successResponse<T>(data: T, message?: string, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status },
  )
}

export function errorResponse(error: string, status = 500): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status },
  )
}

export function handleApiError(error: unknown): NextResponse<ApiResponse> {
  console.error("API Error:", error)

  if (error instanceof ApiError) {
    return errorResponse(error.message, error.statusCode)
  }

  if (error instanceof Error) {
    return errorResponse(error.message, 500)
  }

  return errorResponse("Internal server error", 500)
}
