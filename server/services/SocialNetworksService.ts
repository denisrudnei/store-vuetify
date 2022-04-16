import { SocialNetworks } from '../models/SocialNetworks'
import { EditSocialNetworksInput } from '../inputs/EditSocialNetworksInput'

export class SocialNetworksService {
  public static async getSocialNetworks() {
    let socialNetworks = await SocialNetworks.findOne({})
    if (socialNetworks) return socialNetworks
    socialNetworks = SocialNetworks.create()
    return socialNetworks.save()
  }

  public static async edit(socialNetworksToEdit: EditSocialNetworksInput) {
    const socialNetworks = await this.getSocialNetworks()
    Object.assign(socialNetworks, socialNetworksToEdit)
    return socialNetworks.save()
  }
}
