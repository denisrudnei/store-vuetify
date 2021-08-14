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
export class Address extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id!: number

  @Field(() => User)
  @ManyToOne(() => User)
  public user!: User

  @Field()
  @Column({ default: '', name: 'zip_code' })
  public zipCode!: string

  @Field()
  @Column({ default: '' })
  public country!: string

  @Field()
  @Column({ default: '' })
  public city!: string

  @Field()
  @Column({ default: '' })
  public street!: string

  @Field()
  @Column({ default: '' })
  public number!: string

  @Field()
  @Column({ default: '' })
  public district!: string

  @Field()
  @Column({ default: '' })
  public state!: string

  @Field(() => String)
  public fullName() {
    return `${this.street} - ${this.city}, ${this.state} (${this.zipCode})`
  }
}
