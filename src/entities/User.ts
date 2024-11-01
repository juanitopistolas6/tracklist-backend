import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import * as bcrypt from 'bcrypt'
import { Expense } from './Expense'

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: false })
  password: string

  @Column({ nullable: true })
  salt: string

  @Column()
  name: string

  @Column('simple-array')
  paymentDays: number[]

  @Column({ nullable: false })
  paymentFrequency: 'weekly' | 'biweekly'

  @Column({ default: 0, type: 'float' })
  salary: number

  @Column({ unique: true })
  user: string

  @Column({ type: 'float' })
  balance: number

  @Column({ type: 'boolean', default: false, nullable: true })
  is_saving: boolean

  @Column({ type: 'float', default: 0, nullable: true })
  savings: number

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @OneToMany(() => Expense, (expense) => expense.author)
  posts: Expense[]

  @BeforeInsert()
  async generateColumns() {
    this.salt = await bcrypt.genSalt(10)

    this.password = await bcrypt.hash(this.password, this.salt)
  }
}
