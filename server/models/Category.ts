import { Field, ID, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Product } from './Product'

@Entity()
@ObjectType()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  public id!: number

  @Field()
  @Column()
  public name!: string

  @Field()
  @Column({ type: 'text' })
  public description!: string

  @Field(() => [Product])
  @OneToMany(() => Product, (product) => product.category)
  public products!: Product[]
}
