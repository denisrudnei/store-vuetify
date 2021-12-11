import { Field, Float, InputType, ID } from 'type-graphql'
import { Category } from '../../models/Category'
import { Product } from '../../models/Product'
import { ProductType } from '../../enums/ProductType'

@InputType()
export class SyncProductInput {
  @Field(() => ID)
  public id!: Product['id']

  @Field({ nullable: true })
  public name?: string

  @Field({ nullable: true })
  public barcode?: string

  @Field({ nullable: true })
  public description?: string

  @Field(() => Float, { nullable: true })
  public price?: number

  @Field(() => Float, { nullable: true })
  public amount?: number

  @Field(() => [ProductType], { nullable: true })
  public type?: ProductType[]

  @Field(() => ID, { nullable: true })
  public category?: Category['id']
}
