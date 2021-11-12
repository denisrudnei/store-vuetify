import { InputType, Field, ID } from 'type-graphql'
import { LoadLogType } from '../enums/LoadLogType'

@InputType()
export class CreateLoadLogInput {
  @Field(() => ID)
  public pos!: number

  @Field()
  public message!: string

  @Field(() => LoadLogType)
  public type!: LoadLogType
}
