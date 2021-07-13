import { Field, ObjectType, ID } from 'type-graphql'
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm'
import bcrypt from 'bcryptjs'
import { Role } from '../enums/Role'

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

  @Column()
  public password!: string

  @Column()
  public tempPassword!: string

  @Field()
  @Column({ default: false })
  public active!: boolean

  @Column({ default: Role.USER, type: 'varchar' })
  public role!: Role

  @Column({ default: true })
  public darkTheme!: Boolean

  @AfterLoad()
  verifyPassword() {
    this.tempPassword = this.password
  }

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    if (this.password && this.password !== this.tempPassword) {
      const salt = bcrypt.genSaltSync(12)
      this.password = bcrypt.hashSync(this.password, salt)
    }
    this.tempPassword = ''
  }
}
