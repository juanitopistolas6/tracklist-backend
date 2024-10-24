export interface User {
  id: string
  name: string
  user: string
  paymentDays: number[]
  paymentFrequency: 'weekly' | 'biweekly'
  salary: number
  balance: string
}
