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

  @Column({ nullable: false })
  amount: number

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @ManyToOne(() => User)
  @JoinColumn()
  author: User
}
