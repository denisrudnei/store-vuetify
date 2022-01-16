import { InputType, Field } from 'type-graphql'
import { OriginPointInput } from './OriginPointInput'

@InputType()
export class CreateBarcodeItemInput {
  @Field()
  public name!: String

  @Field(() => OriginPointInput)
  public origin!: OriginPointInput

  @Field()
  public showNumbers!: boolean
}
