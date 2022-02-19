import { Field, Int, ObjectType } from 'type-graphql'

import { PageInfo } from './PageInfo'

export function PaginatedResponse() {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedEdgeClass {
    @Field(() => Int)
    public total!: number

    @Field(() => PageInfo)
    public pageInfo!: PageInfo
  }
  return PaginatedEdgeClass
}
