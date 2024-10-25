export interface IUser {
  id: string
  name: string
  user: string
  paymentDays: number[]
  paymentFrequency: 'weekly' | 'biweekly'
  salary: number
  balance: string
}
