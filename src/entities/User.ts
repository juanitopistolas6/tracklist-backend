import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'
import bcrypt from 'bcrypt'

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

  @Column({ unique: true })
  user: string

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @BeforeInsert()
  async generateColumns() {
    this.salt = await bcrypt.genSalt(10)

    this.password = await bcrypt.hash(this.password, this.salt)
  }
}
