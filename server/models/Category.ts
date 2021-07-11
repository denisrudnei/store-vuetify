import { Field, ID, ObjectType } from 'type-graphql'
import slugify from 'slugify'
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
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
  @Column({ unique: true })
  public name!: string

  @Field()
  @Column({ type: 'text', default: '' })
  public description!: string

  @Field()
  @Column()
  public slug: string = ''

  @Field(() => [Product])
  @OneToMany(() => Product, (product) => product.category)
  public products!: Product[]

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, (category) => category.subCategories)
  public father!: Category

  @Field(() => [Category])
  @OneToMany(() => Category, (category) => category.father)
  public subCategories!: Category[]

  @BeforeUpdate()
  @BeforeInsert()
  update() {
    this.slug = slugify(this.name, {
      replacement: '-',
      lower: true,
    })
  }
}
