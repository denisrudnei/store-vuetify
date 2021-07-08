import { Field, ObjectType, ID } from 'type-graphql'
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm'

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id!: number

  @Field()
  @Column()
  public email!: string

  @Field()
  @Column()
  public name!: string

  @Field()
  @Column()
  public password!: string
}
