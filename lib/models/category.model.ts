export interface ICategory {
    id: string
    name: string
    icon: string
    color: string
    type: "income" | "expense"
  }
  
  export const PREDEFINED_CATEGORIES: ICategory[] = [
    // Expense Categories
    { id: "food", name: "Food & Dining", icon: "🍽️", color: "#FF6B6B", type: "expense" },
    { id: "transportation", name: "Transportation", icon: "🚗", color: "#4ECDC4", type: "expense" },
    { id: "shopping", name: "Shopping", icon: "🛍️", color: "#45B7D1", type: "expense" },
    { id: "entertainment", name: "Entertainment", icon: "🎬", color: "#96CEB4", type: "expense" },
    { id: "bills", name: "Bills & Utilities", icon: "💡", color: "#FFEAA7", type: "expense" },
    { id: "healthcare", name: "Healthcare", icon: "🏥", color: "#DDA0DD", type: "expense" },
    { id: "education", name: "Education", icon: "📚", color: "#98D8C8", type: "expense" },
    { id: "travel", name: "Travel", icon: "✈️", color: "#F7DC6F", type: "expense" },
    { id: "fitness", name: "Fitness & Sports", icon: "💪", color: "#BB8FCE", type: "expense" },
    { id: "other-expense", name: "Other Expenses", icon: "📦", color: "#AED6F1", type: "expense" },
  
    // Income Categories
    { id: "salary", name: "Salary", icon: "💰", color: "#58D68D", type: "income" },
    { id: "freelance", name: "Freelance", icon: "💻", color: "#5DADE2", type: "income" },
    { id: "investment", name: "Investment", icon: "📈", color: "#F8C471", type: "income" },
    { id: "business", name: "Business", icon: "🏢", color: "#85C1E9", type: "income" },
    { id: "other-income", name: "Other Income", icon: "💎", color: "#82E0AA", type: "income" },
  ]
  