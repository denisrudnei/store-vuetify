import { InputType, Field, ID } from 'type-graphql'
import { PrinterType } from '../../enums/PrinterType'
import { POS } from '../../models/POS'

@InputType()
export class UpdatePrinterInput {
  @Field({ nullable: true })
  public name?: string

  @Field({ nullable: true })
  public manufacturer?: string

  @Field({ nullable: true })
  public model?: string

  @Field({ nullable: true })
  public path?: string

  @Field(() => ID)
  public installedIn?: POS['id']

  @Field(() => PrinterType, { nullable: true })
  public type?: PrinterType
}
