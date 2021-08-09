import { Field, ID, ObjectType } from 'type-graphql'
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
@ObjectType()
export class SiteSettings extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  public id!: number

  @Field()
  @Column({ default: '/images/not-set.svg' })
  public logo!: string

  @Field()
  @Column({ default: 'Shop' })
  public name!: string

  @Field()
  @Column({ default: 'USD' })
  public currency!: string

  @Field()
  @Column({ default: '' })
  public locale!: string

  @Field()
  @Column({ default: true })
  public isDark!: boolean

  @Field()
  @Column({ default: '#1976D2' })
  public darkPrimary!: string

  @Field()
  @Column({ default: '#FF8F00' })
  public darkSecondary!: string

  @Field()
  @Column({ default: '#424242' })
  public darkAccent!: string

  @Field()
  @Column({ default: '#1976D2' })
  public lightPrimary!: string

  @Field()
  @Column({ default: '#424242' })
  public lightSecondary!: string

  @Field()
  @Column({ default: '#82B1FF' })
  public lightAccent!: string
}
