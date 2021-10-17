import {
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  Entity,
  OneToMany,
} from 'typeorm'
import { ID, Field, ObjectType } from 'type-graphql'
import { Purchase } from './Purchase'

@Entity()
@ObjectType()
export class EstablishmentTable extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id!: number

  @Field()
  @Column()
  public name!: string

  @Field(() => Purchase)
  public activeOrder!: Purchase

  @OneToMany(() => Purchase, (purchase) => purchase.establishmentTable)
  @Field(() => [Purchase])
  public orders!: Purchase[]
}
