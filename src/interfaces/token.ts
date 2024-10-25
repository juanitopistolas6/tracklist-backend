import { User } from '../entities'

export interface Token {
  user: User
  token: string
}
