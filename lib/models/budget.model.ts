import mongoose, { type Document, Schema } from "mongoose"

export interface IBudget extends Document {
  _id: string
  category: string
  amount: number
  month: number
  year: number
  spent: number
  createdAt: Date
  updatedAt: Date
}

const BudgetSchema = new Schema<IBudget>(
  {
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Budget amount is required"],
      min: [0, "Budget amount must be positive"],
    },
    month: {
      type: Number,
      required: [true, "Month is required"],
      min: [1, "Month must be between 1 and 12"],
      max: [12, "Month must be between 1 and 12"],
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
      min: [2020, "Year must be 2020 or later"],
    },
    spent: {
      type: Number,
      default: 0,
      min: [0, "Spent amount cannot be negative"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Compound index to ensure unique budget per category per month/year
BudgetSchema.index({ category: 1, month: 1, year: 1 }, { unique: true })

// Virtual for remaining budget
BudgetSchema.virtual("remaining").get(function () {
  return Math.max(0, this.amount - this.spent)
})

// Virtual for budget status
BudgetSchema.virtual("status").get(function () {
  const percentage = (this.spent / this.amount) * 100
  if (percentage >= 100) return "exceeded"
  if (percentage >= 80) return "warning"
  return "good"
})

export default mongoose.models.Budget || mongoose.model<IBudget>("Budget", BudgetSchema)
