import { Field, ID, ObjectType } from 'type-graphql'
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
@ObjectType()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  public id!: number

  @Field()
  @Column()
  public name!: string

  @Field()
  @Column({ type: 'text' })
  public description!: string

  @Field()
  @Column({ type: 'decimal' })
  public price!: number
}
