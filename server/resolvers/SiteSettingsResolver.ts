import { Arg, Mutation, Query, Resolver } from 'type-graphql'
import { SiteSettings } from '../models/SiteSettings'
import { SiteSettingsService } from '../services/SiteSettingsService'
import { EditSiteSettingsInput } from '../../inputs/EditSiteSettingsInput'

@Resolver()
export class SiteSettingsResolver {
  @Query(() => SiteSettings)
  public GetSiteSettings() {
    return SiteSettingsService.getSiteSettings()
  }

  @Mutation(() => SiteSettings)
  public EditSiteSettings(
    @Arg('settings', () => EditSiteSettingsInput)
    settings: EditSiteSettingsInput
  ) {
    return SiteSettingsService.editSiteSettings(settings)
  }
}
