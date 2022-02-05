import { InputType, Field, ID } from 'type-graphql'
import { PrinterType } from '../../enums/PrinterType'

@InputType()
export class CreatePrinterInput {
  @Field()
  public name!: string

  @Field()
  public manufacturer!: string

  @Field()
  public model!: string

  @Field()
  public path!: string

  @Field(() => ID)
  public installedIn!: string

  @Field(() => PrinterType, { nullable: true })
  public type?: PrinterType
}
