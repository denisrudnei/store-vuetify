import { Field, ObjectType, ID } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Address } from './Address'
import { Product } from './Product'
import { PurchaseReceipt } from './PurchaseReceipt'

@ObjectType()
@Entity()
export class Supplier extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  public id!: string

  @Field()
  @Column({ unique: true })
  public name!: string

  @Field()
  @Column({ unique: true })
  public cnpj!: string

  @Field()
  @Column()
  public ie!: string

  @Field(() => Address)
  @OneToOne(() => Address, (address) => address.supplier)
  public address!: Address

  @Field(() => [Product])
  @ManyToMany(() => Product, (product) => product.suppliers)
  @JoinColumn()
  public products!: Product[]

  @Field(() => [PurchaseReceipt])
  @OneToMany(
    () => PurchaseReceipt,
    (purchaseReceipt) => purchaseReceipt.supplier
  )
  public purchaseReceipts!: PurchaseReceipt[]

  @Field()
  @CreateDateColumn()
  public createdAt!: Date

  @Field({ nullable: true })
  @DeleteDateColumn()
  public deletedAt?: Date
}
