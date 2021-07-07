import { Field, ID, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import slugify from 'slugify'
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

  @Field()
  @Column({ default: '' })
  public slug!: string

  @BeforeInsert()
  @BeforeUpdate()
  update() {
    this.slug = slugify(this.name, {
      replacement: '-',
      lower: true,
    })
  }

  @Field()
  @DeleteDateColumn()
  public deletedAt?: Date
}