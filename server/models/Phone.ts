import { Length } from 'class-validator'
import { Field, ID, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { User } from './User'

@ObjectType()
@Entity()
export class Phone extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id!: number

  @Field(() => String)
  @Column()
  @Length(3)
  public description!: string

  @Field(() => String)
  @Column()
  @Length(8)
  public number!: string

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.phones)
  public user!: User
}
