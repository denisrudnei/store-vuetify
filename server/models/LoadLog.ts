import { Field, ID, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { LoadLogType } from '../enums/LoadLogType'
import { POS } from './POS'

@ObjectType()
@Entity()
export class LoadLog extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Field(() => POS)
  @ManyToOne(() => POS, (pos) => pos.loadLogs)
  public pos!: POS

  @Field()
  @Column()
  public message!: string

  @Field(() => LoadLogType)
  @Column({ type: 'varchar', default: LoadLogType.INFO })
  public type!: LoadLogType

  @CreateDateColumn()
  @Field()
  public createdAt!: Date
}
