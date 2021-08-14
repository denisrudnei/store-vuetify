import { Field, ObjectType, ID } from 'type-graphql'
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm'
import bcrypt from 'bcryptjs'
import { Role } from '../enums/Role'
import { Address } from './Address'
import { Purchase } from './Purchase'
import { Order } from './Order'
import { Phone } from './Phone'

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
  @Column({ default: '/images/not-set.svg' })
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

  @Field(() => [Phone])
  @OneToMany(() => Phone, (phone) => phone.user)
  public phones!: Phone[]

  @Field(() => [Purchase])
  @OneToMany(() => Purchase, (purchase) => purchase.user)
  public purchases!: Purchase[]

  @Field(() => [Order])
  @OneToMany(() => Order, (order) => order.user)
  public orders!: Order[]

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
