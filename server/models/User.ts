import bcrypt from 'bcryptjs'
import { Field, ID, ObjectType } from 'type-graphql'
import {
  AfterLoad,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Role } from '../enums/Role'
import { Address } from './Address'
import { Notification } from './notification/Notification'
import { Phone } from './Phone'
import { Purchase } from './Purchase'

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
  @Column({ default: '/images/profile.jpg' })
  public image!: string

  @Column()
  public password!: string

  @Column()
  public tempPassword!: string

  @Field()
  @Column({ default: false })
  public active!: boolean

  @Field(() => [Address], { nullable: true })
  @OneToMany(() => Address, (address) => address.user)
  public addresses!: Address[]

  @Field(() => [Notification])
  @OneToMany(() => Notification, (notification) => notification.user)
  public notifications!: Notification[]

  @Field(() => [Phone])
  @OneToMany(() => Phone, (phone) => phone.user)
  public phones!: Phone[]

  @Field(() => [Purchase])
  @OneToMany(() => Purchase, (purchase) => purchase.user)
  public purchases!: Purchase[]

  @Field(() => [Purchase])
  @OneToMany(() => Purchase, (purchase) => purchase.operator)
  public purchasesMade!: Purchase[]

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
