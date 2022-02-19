import { Field, ID, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { LoadLog } from './LoadLog'
import { Printer } from './printer/Printer'
import { Purchase } from './Purchase'

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
  public printers!: Printer[]

  @Field()
  @CreateDateColumn()
  public createdAt!: Date

  @Field({ nullable: true })
  @UpdateDateColumn()
  public updatedAt?: Date

  @Field({ nullable: true })
  @DeleteDateColumn()
  public deletedAt?: Date

  @Field()
  @Column({ default: '' })
  public hostname!: string
}
