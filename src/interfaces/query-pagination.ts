import { IExpense } from './expense'

export interface IPagination {
  expenses: IExpense[]
  page: number
  limit: number
  totalPages: number
}
