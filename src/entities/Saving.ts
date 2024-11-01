import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'
import { User } from './User'

@Entity('saving')
@Unique(['user'])
export class Saving {
  @PrimaryGeneratedColumn('uuid')
  id_saving: string

  @OneToOne(() => User)
  @JoinColumn()
  user: User

  @Column({ nullable: false })
  saving: number
}
