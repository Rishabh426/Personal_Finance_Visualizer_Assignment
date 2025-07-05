import { z } from "zod"

export const TransactionSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required").max(200, "Description too long"),
  category: z.string().min(1, "Category is required"),
  date: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val)),
  type: z.enum(["income", "expense"]).default("expense"),
})

export const BudgetSchema = z.object({
  category: z.string().min(1, "Category is required"),
  amount: z.number().positive("Budget amount must be positive"),
  month: z.number().min(1).max(12),
  year: z.number().min(2020),
})

export const UpdateTransactionSchema = TransactionSchema.partial()
export const UpdateBudgetSchema = BudgetSchema.partial()

export type TransactionInput = z.infer<typeof TransactionSchema>
export type BudgetInput = z.infer<typeof BudgetSchema>
export type UpdateTransactionInput = z.infer<typeof UpdateTransactionSchema>
export type UpdateBudgetInput = z.infer<typeof UpdateBudgetSchema>
