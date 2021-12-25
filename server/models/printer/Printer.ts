import { ObjectType, Field, ID } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { POS } from '../POS'

@ObjectType()
@Entity()
export class Printer extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Field()
  @Column()
  public name!: string

  @Field()
  @Column()
  public manufacturer!: string

  @Field()
  @Column()
  public model!: string

  @Field()
  @Column()
  public path!: string

  @Field()
  @CreateDateColumn()
  public createdAt!: Date

  @Field()
  @UpdateDateColumn()
  public updatedAt!: Date

  @Field(() => POS)
  @ManyToOne(() => POS, (pos) => pos.printers)
  public installedIn!: POS

  @Field({ nullable: true })
  @DeleteDateColumn()
  public deletedAt?: Date
}
