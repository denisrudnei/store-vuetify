import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql'

import { EditSiteSettingsInput } from '../inputs/EditSiteSettingsInput'
import { SiteSettings } from '../models/SiteSettings'
import { SiteSettingsService } from '../services/SiteSettingsService'
import { Role } from '../enums/Role'

@Resolver()
export class SiteSettingsResolver {
  @Query(() => SiteSettings)
  public GetSiteSettings() {
    return SiteSettingsService.getSiteSettings()
  }

  @Mutation(() => SiteSettings)
  @Authorized(Role.ADMIN)
  public EditSiteSettings(
    @Arg('settings', () => EditSiteSettingsInput)
    settings: EditSiteSettingsInput
  ) {
    return SiteSettingsService.editSiteSettings(settings)
  }
}
