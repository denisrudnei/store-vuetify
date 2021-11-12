import { ObjectType, ID, Field } from 'type-graphql'
import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
} from 'typeorm'
import { LoadLogType } from '../enums/LoadLogType'
import { POS } from './POS'

@ObjectType()
@Entity()
export class LoadLog extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id!: number

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
