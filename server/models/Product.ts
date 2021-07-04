import { Field, ID, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Category } from './Category'

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

  @Field(() => Category)
  @ManyToOne(() => Category)
  public category?: Category

  @Field()
  @Column({ type: 'decimal' })
  public price!: number

  @DeleteDateColumn()
  public deletedAt?: Date
}
