import { Field, ObjectType } from 'type-graphql'

import { Category } from '../models/Category'
import { Product } from '../models/Product'
import { User } from '../models/User'

@ObjectType()
export class LoadData {
  @Field(() => [Product])
  public products!: Product[]

  @Field(() => [User])
  public users!: User[]

  @Field(() => [Category])
  public categories!: Category[]
}
