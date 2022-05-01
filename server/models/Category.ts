import { Field, ID, ObjectType } from 'type-graphql'
import slugify from 'slugify'
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { ProductType } from '../enums/ProductType'
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

  @Field()
  @Column({ default: '/images/not-set.svg' })
  public image!: string

  @OneToMany(() => Product, (product) => product.category)
  public products!: Product[]

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, (category) => category.subCategories)
  public father?: Category | null

  @OneToMany(() => Category, (category) => category.father)
  public subCategories!: Category[]

  @Field(() => [ProductType])
  @Column({ type: 'varchar', default: [ProductType.ECOMMERCE], array: true })
  public productsTypes!: ProductType[]

  @Field()
  @UpdateDateColumn()
  public updatedAt?: Date

  @Field({ nullable: true })
  @DeleteDateColumn()
  public deletedAt?: Date

  @BeforeUpdate()
  @BeforeInsert()
  update() {
    this.slug = slugify(this.name, {
      replacement: '-',
      lower: true,
    })
  }
}
