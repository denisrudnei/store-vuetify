import { InputType, Field } from 'type-graphql'

@InputType()
export class EditSiteSettingsInput {
  @Field()
  public name!: string

  @Field()
  public logo!: string

  @Field()
  public address!: string

  @Field()
  public cnpj!: string

  @Field()
  public isDark!: boolean

  @Field()
  public darkPrimary!: string

  @Field()
  public darkSecondary!: string

  @Field()
  public darkAccent!: string

  @Field()
  public lightPrimary!: string

  @Field()
  public lightSecondary!: string

  @Field()
  public lightAccent!: string
}
