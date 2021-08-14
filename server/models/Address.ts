import { IsNotEmpty, Length } from 'class-validator'
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
  @Length(8, 8)
  public zipCode!: string

  @Field()
  @Column({ default: '' })
  @Length(5)
  public country!: string

  @Field()
  @Column({ default: '' })
  @Length(5)
  public city!: string

  @Field()
  @Column({ default: '' })
  @Length(5)
  public street!: string

  @Field()
  @Column({ default: '' })
  @IsNotEmpty()
  public number!: string

  @Field()
  @Column({ default: '' })
  @Length(5)
  public district!: string

  @Field()
  @Column({ default: '' })
  @Length(2)
  public state!: string

  @Field(() => String)
  public fullName() {
    return `${this.street} - ${this.city}, ${this.state} (${this.zipCode})`
  }
}
