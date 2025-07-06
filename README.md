# 💰 Personal Finance Visualizer

A comprehensive web application for tracking personal finances, managing budgets, and visualizing spending patterns. Built with Next.js, TypeScript, MongoDB, and modern UI components.

![Personal Finance Visualizer](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🚀 Features

### Stage 1: Basic Transaction Tracking ✅
- ➕ **Add/Edit/Delete Transactions** - Complete CRUD operations for financial transactions
- 📊 **Transaction List View** - Paginated list with search and filtering capabilities
- 📈 **Monthly Expenses Chart** - Interactive bar chart showing spending trends
- ✅ **Form Validation** - Real-time validation with error handling

### Stage 2: Categories ✅
- 🏷️ **Predefined Categories** - 15 expense and income categories with icons
- 🥧 **Category Pie Chart** - Visual breakdown of expenses by category
- 📋 **Dashboard Summary** - Cards showing total expenses, income, and insights
- 🔍 **Category Filtering** - Filter transactions by category and type

### Stage 3: Budgeting ✅
- 💰 **Monthly Budget Setting** - Set budgets for each expense category
- 📊 **Budget vs Actual Comparison** - Visual progress bars and status indicators
- ⚠️ **Spending Insights** - Warnings when approaching or exceeding budgets
- 📈 **Budget Analytics** - Track spending patterns and budget performance

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **State Management**: Custom hooks with React Query patterns

### Backend
- **API**: Next.js API Routes
- **Database**: MongoDB Atlas
- **ODM**: Mongoose
- **Validation**: Zod schemas
- **Error Handling**: Custom error classes and middleware

### Development
- **Package Manager**: npm
- **Linting**: ESLint + TypeScript ESLint
- **Code Formatting**: Prettier (recommended)
- **Type Checking**: TypeScript strict mode

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/yourusername/personal-finance-visualizer.git
cd personal-finance-visualizer
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Setup
Create a `.env.local` file in the root directory:

\`\`\`env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/personal-finance?retryWrites=true&w=majority

# Next.js Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
\`\`\`

### 4. Initialize shadcn/ui (if not already done)
\`\`\`bash
npx shadcn@latest init
\`\`\`

### 5. Add Required shadcn/ui Components
\`\`\`bash
npx shadcn@latest add button card input form select textarea
npx shadcn@latest add dialog alert-dialog popover calendar
npx shadcn@latest add badge progress toast chart
\`\`\`

### 6. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🗂️ Project Structure

\`\`\`
personal-finance-visualizer/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── transactions/         # Transaction CRUD endpoints
│   │   ├── budgets/             # Budget management endpoints
│   │   ├── categories/          # Category endpoints
│   │   └── analytics/           # Dashboard analytics
│   ├── transactions/            # Transactions page
│   ├── budgets/                 # Budgets page
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Dashboard page
│   └── globals.css              # Global styles
├── components/                   # React Components
│   ├── ui/                      # shadcn/ui components
│   ├── charts/                  # Chart components
│   ├── transaction-form.tsx     # Transaction form
│   ├── transaction-list.tsx     # Transaction list
│   ├── budget-form.tsx          # Budget form
│   └── dashboard-cards.tsx      # Dashboard summary cards
├── hooks/                       # Custom React hooks
│   ├── use-transactions.ts      # Transaction management
│   ├── use-budgets.ts          # Budget management
│   └── use-toast.ts            # Toast notifications
├── lib/                         # Utility libraries
│   ├── api.ts                   # API client functions
│   ├── db.ts                    # MongoDB connection
│   ├── models/                  # Mongoose models
│   └── utils/                   # Utility functions
├── types/                       # TypeScript type definitions
└── README.md                    # Project documentation
\`\`\`

## 🔧 API Endpoints

### Transactions
- `GET /api/transactions` - List transactions (with pagination/filtering)
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions/[id]` - Get single transaction
- `PATCH /api/transactions/[id]` - Update transaction
- `DELETE /api/transactions/[id]` - Delete transaction

### Budgets
- `GET /api/budgets` - List budgets with spending calculations
- `POST /api/budgets` - Create new budget
- `PATCH /api/budgets/[id]` - Update budget
- `DELETE /api/budgets/[id]` - Delete budget

### Categories
- `GET /api/categories` - Get predefined categories
- `GET /api/categories?type=expense` - Filter by type

### Analytics
- `GET /api/analytics` - Dashboard summary data

## 🎨 UI Components

### Pre-built Categories
The application includes 15 predefined categories:

**Expense Categories:**
- 🍽️ Food & Dining
- 🚗 Transportation  
- 🛍️ Shopping
- 🎬 Entertainment
- 💡 Bills & Utilities
- 🏥 Healthcare
- 📚 Education
- ✈️ Travel
- 💪 Fitness & Sports
- 📦 Other Expenses

**Income Categories:**
- 💰 Salary
- 💻 Freelance
- 📈 Investment
- 🏢 Business
- 💎 Other Income

### Design System
- **Colors**: Semantic color usage with CSS variables
- **Typography**: Inter font with clear hierarchy
- **Spacing**: Consistent Tailwind spacing scale
- **Components**: Accessible shadcn/ui components
- **Icons**: Lucide React icon library

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically on push

3. **Environment Variables in Vercel**
   \`\`\`
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_secret_key
   NEXTAUTH_URL=https://your-app.vercel.app
   \`\`\`

### Manual Build
\`\`\`bash
npm run build
npm start
\`\`\`

## 🧪 Testing

### Type Checking
\`\`\`bash
npx tsc --noEmit
\`\`\`

### Build Test
\`\`\`bash
npm run build
\`\`\`

### Linting
\`\`\`bash
npm run lint
\`\`\`

## 📊 Database Schema

### Transaction Model
\`\`\`typescript
{
  amount: Number,
  description: String,
  category: String,
  date: Date,
  type: "income" | "expense",
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### Budget Model
\`\`\`typescript
{
  category: String,
  amount: Number,
  month: Number,
  year: Number,
  spent: Number,
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Recharts](https://recharts.org/) - Chart library
- [MongoDB](https://www.mongodb.com/) - Database
- [Vercel](https://vercel.com/) - Deployment platform

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Review the API endpoints

---

**Built with ❤️ for better financial management**
