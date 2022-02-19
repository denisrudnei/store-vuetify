import { ClassType, Field, ObjectType } from 'type-graphql'

export function PaginatedEdge<TItem>(TItemClass: ClassType<TItem>) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedEdgeClass {
    @Field(() => TItemClass)
    public node!: TItem

    @Field(() => String)
    public cursor!: number | string
  }
  return PaginatedEdgeClass
}
