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

  @Field(() => [Product])
  @OneToMany(() => Product, (product) => product.category)
  public products!: Product[]

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, (category) => category.subCategories)
  public father?: Category | null

  @Field(() => [Category])
  @OneToMany(() => Category, (category) => category.father)
  public subCategories!: Category[]

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
