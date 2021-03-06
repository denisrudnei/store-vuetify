import { Field, ID, ObjectType, Float } from 'type-graphql'
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import slugify from 'slugify'
import sanitize from 'sanitize-html'
import { ProductType } from '../enums/ProductType'
import { Category } from './Category'
import { Supplier } from './Supplier'

@Entity()
@ObjectType()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field(() => ID)
  public id!: number

  @Field()
  @Column()
  public name!: string

  @Field()
  @Column({ default: '' })
  public barcode!: string

  @Field()
  @Column({ type: 'text' })
  public description!: string

  @Field(() => Float)
  @Column({ type: 'decimal', default: 0 })
  public amount!: number

  @Field(() => [String])
  @Column({ type: 'simple-array', default: '' })
  public images: string[] = []

  @Field(() => Category)
  @ManyToOne(() => Category)
  public category?: Category

  @Field()
  @Column({ type: 'decimal' })
  public price!: number

  @Field()
  @Column({ default: '' })
  public slug!: string

  @Field(() => [ProductType])
  @Column({
    type: 'varchar',
    default: [ProductType.ECOMMERCE],
    array: true,
  })
  public type!: ProductType[]

  @Field(() => String)
  public primaryImage() {
    if (this.images.length) return this.images[0]
    return '/images/not-set.svg'
  }

  @Field({ nullable: true })
  @Column({ nullable: true })
  public imageUpdatedAt?: Date

  @BeforeInsert()
  @BeforeUpdate()
  update() {
    this.slug = slugify(this.name, {
      replacement: '-',
      lower: true,
    })
    this.description = sanitize(this.description, {
      allowedTags: sanitize.defaults.allowedTags.concat(['img', 'a']),
    })
  }

  @Field()
  @Column({ default: true })
  public synchronized!: boolean

  @Field()
  @UpdateDateColumn()
  public updatedAt?: Date

  @Field({ nullable: true })
  @DeleteDateColumn()
  public deletedAt?: Date

  @Field(() => [Supplier])
  @ManyToMany(() => Supplier, (supplier) => supplier.products)
  public suppliers!: Supplier[]
}
