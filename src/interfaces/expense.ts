import { User } from '../entities'

export interface ICreateExpense {
  description: string
  amount: number
}

export interface IExpense extends ICreateExpense {
  id: string
  expenseDate: Date
  author: User
}
