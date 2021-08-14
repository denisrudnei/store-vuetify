import { Length } from 'class-validator'
import { ObjectType, Field } from 'type-graphql'
import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  Column,
} from 'typeorm'
import { User } from './User'

@ObjectType()
@Entity()
export class Phone extends BaseEntity {
  @Field()
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
