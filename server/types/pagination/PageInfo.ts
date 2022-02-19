import { ObjectType, Field, ID } from 'type-graphql'
@ObjectType()
export class PageInfo {
  @Field(() => ID)
  public endCursor!: number | string

  @Field()
  public hasNextPage!: boolean

  @Field()
  public pages!: number

  @Field()
  public page!: number
}
