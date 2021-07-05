import ggl from 'graphql-tag'

export const GetSiteSettings = ggl`
query {
  GetSiteSettings {
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
