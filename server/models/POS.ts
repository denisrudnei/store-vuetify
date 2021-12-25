import { ObjectType, ID, Field } from 'type-graphql'
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Purchase } from './Purchase'
import { LoadLog } from './LoadLog'
import { Printer } from './printer/Printer'

@ObjectType()
@Entity()
export class POS extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id!: number

  @Field()
  @Column()
  public name!: string

  @Field(() => [Purchase])
  @OneToMany(() => Purchase, (purchase) => purchase.pos)
  public purchases!: Purchase[]

  @Field(() => [LoadLog])
  @OneToMany(() => LoadLog, (log) => log.pos)
  public loadLogs!: LoadLog[]

  @Field(() => [Printer])
  @OneToMany(() => Printer, (printer) => printer.installedIn)
  public printers!: []

  @Field()
  @CreateDateColumn()
  public createdAt!: Date

  @Field({ nullable: true })
  @UpdateDateColumn()
  public updatedAt?: Date
}
