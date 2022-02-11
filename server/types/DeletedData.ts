import { Field, ObjectType } from 'type-graphql'

import { Category } from '../models/Category'
import { POS } from '../models/POS'
import { PrintLayout } from '../models/print_layout/PrintLayout'
import { Printer } from '../models/printer/Printer'
import { Product } from '../models/Product'
import { User } from '../models/User'

@ObjectType()
export class DeletedData {
  @Field(() => [User])
  public products!: Product[]

  @Field(() => [User])
  public users!: User[]

  @Field(() => [Category])
  public categories!: Category[]

  @Field(() => [POS])
  public pos!: POS[]

  @Field(() => [Printer])
  public printers!: Printer[]

  @Field(() => [PrintLayout])
  public printLayouts!: PrintLayout[]
}
