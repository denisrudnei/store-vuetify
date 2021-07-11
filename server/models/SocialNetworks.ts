import { Field, ObjectType, ID } from 'type-graphql'
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm'

@ObjectType()
@Entity()
export class SocialNetworks extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  public id!: number

  @Field({ nullable: true })
  @Column({ nullable: true })
  public facebook?: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  public youtube?: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  public twitter?: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  public discord?: string
}
