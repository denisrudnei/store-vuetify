import { ObjectType, ID, Field } from 'type-graphql'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Purchase } from './Purchase'

@ObjectType()
@Entity()
export class POS {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id!: number

  @Field()
  @Column()
  public name!: string

  @Field(() => [Purchase])
  @OneToMany(() => Purchase, (purchase) => purchase.pos)
  public purchases!: Purchase[]
}
