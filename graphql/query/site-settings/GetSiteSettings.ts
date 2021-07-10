import ggl from 'graphql-tag'

export const GetSiteSettings = ggl`
query {
  GetSiteSettings {
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
