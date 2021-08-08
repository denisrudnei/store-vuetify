import { SiteSettings } from '../models/SiteSettings'
import { EditSiteSettingsInput } from '../inputs/EditSiteSettingsInput'

export class SiteSettingsService {
  public static async getSiteSettings() {
    let siteSettings = await SiteSettings.findOne()
    if (siteSettings) return siteSettings
    siteSettings = SiteSettings.create()
    return siteSettings.save()
  }

  public static async editSiteSettings(settings: EditSiteSettingsInput) {
    const siteSettings = await this.getSiteSettings()
    Object.assign(siteSettings, settings)
    return siteSettings.save()
  }

  public static async updateCurrency(currency: string) {
    const siteSettings = await this.getSiteSettings()

    await SiteSettings.update(
      {
        id: siteSettings.id,
      },
      {
        currency,
      }
    )
    return true
  }
}
