import { InputType, Field } from 'type-graphql'

@InputType()
export class AddHeaderInput {
  @Field({ defaultValue: true })
  public storeName!: boolean

  @Field({ defaultValue: true })
  public address!: boolean

  @Field({ defaultValue: true })
  public cnpj!: boolean
}
