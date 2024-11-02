import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from './User'

@Entity('expense')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: false, type: 'varchar', length: 255 })
  description: string

  @Column({ nullable: false, type: 'float' })
  amount: number

  @Column({ nullable: true, default: true })
  available: boolean

  @Column({ nullable: true, default: 'expense' })
  type: 'deposit' | 'expense' | 'saving'

  @Column({ nullable: true, default: 'success' })
  status: 'pending' | 'success'

  @CreateDateColumn({ type: 'timestamp' })
  expenseDate: Date

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn()
  author: User
}
