import ggl from 'graphql-tag'

export const EditSiteSettings = ggl`
mutation EditSiteSettings($settings: EditSiteSettingsInput!) {
  EditSiteSettings(settings: $settings) {
    name
    id
    name
    isDark
    darkPrimary
    darkSecondary
    darkAccent
    lightPrimary
    lightSecondary
    lightAccent
  }
}
`
