import { Field, ID, ObjectType, Float } from 'type-graphql'
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import slugify from 'slugify'
import sanitize from 'sanitize-html'
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
  @UpdateDateColumn()
  public updatedAt?: Date

  @Field()
  @DeleteDateColumn()
  public deletedAt?: Date
}
