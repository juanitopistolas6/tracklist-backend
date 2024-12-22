import { User } from 'src/entities'

export interface ExpenseUTC {
  expenseDate: string
  id: string
  description: string
  amount: number
  available: boolean
  type: 'deposit' | 'expense' | 'saving'
  status: 'pending' | 'success'
  author: User
}
