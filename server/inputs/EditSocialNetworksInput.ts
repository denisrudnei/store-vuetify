import { Field, InputType } from 'type-graphql'

@InputType()
export class EditSocialNetworksInput {
  @Field({ nullable: true })
  public facebook?: string

  @Field({ nullable: true })
  public youtube?: string

  @Field({ nullable: true })
  public twitter?: string

  @Field({ nullable: true })
  public discord?: string
}
