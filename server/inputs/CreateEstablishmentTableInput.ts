import { Field, InputType } from 'type-graphql'

@InputType()
export class CreateEstablishmentTableInput {
  @Field()
  public name!: string

  @Field(() => Boolean, { nullable: true })
  public inUse?: boolean
}
