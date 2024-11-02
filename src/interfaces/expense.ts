import { User } from '../entities'

export interface ICreateExpense {
  description: string
  expenseDate?: Date
  type?: 'deposit' | 'expense' | 'saving'
  amount: number
}

export interface IExpense extends ICreateExpense {
  id: string
  expenseDate: Date
  author: User
}
