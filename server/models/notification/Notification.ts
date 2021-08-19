import { ID, ObjectType, Field } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from '../User'
import { NotificationOrigin } from './NotificationOrigin'

@ObjectType()
@Entity()
export class Notification extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id!: number

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.notifications)
  public user?: User

  @Field()
  @Column({ type: 'text' })
  public content!: string

  @Field(() => NotificationOrigin)
  @Column({ default: NotificationOrigin.SYSTEM })
  public origin!: NotificationOrigin

  @Field()
  @CreateDateColumn()
  public date!: Date

  @Field()
  @Column({ default: false })
  public read!: boolean
}
