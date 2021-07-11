import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql'
import { SocialNetworks } from '../models/SocialNetworks'
import { SocialNetworksService } from '../services/SocialNetworksService'
import { Role } from '../enums/Role'
import { EditSocialNetworksInput } from '../inputs/EditSocialNetworksInput'

@Resolver()
export class SocialNetworksResolver {
  @Query(() => SocialNetworks)
  public GetSocialNetworks() {
    return SocialNetworksService.getSocialNetworks()
  }

  @Mutation(() => SocialNetworks)
  @Authorized(Role.ADMIN)
  public EditSocialNetworks(
    @Arg('socialNetworks', () => EditSocialNetworksInput)
    socialNetworks: EditSocialNetworksInput
  ) {
    return SocialNetworksService.edit(socialNetworks)
  }
}
