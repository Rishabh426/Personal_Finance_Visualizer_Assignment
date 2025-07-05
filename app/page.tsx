import { DashboardCards } from "@/components/dashboard-cards"
import { MonthlyExpensesChart } from "@/components/charts/monthly-expenses-chart"
import { CategoryPieChart } from "@/components/charts/category-pie-chart"
import { TransactionList } from "@/components/transaction-list"

export default function HomePage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Personal Finance Dashboard</h1>
        <p className="text-muted-foreground">Track your income, expenses, and budgets all in one place.</p>
      </div>

      {/* Dashboard Cards */}
      <DashboardCards />

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <MonthlyExpensesChart />
        <CategoryPieChart />
      </div>

      {/* Recent Transactions */}
      <TransactionList />
    </div>
  )
}
