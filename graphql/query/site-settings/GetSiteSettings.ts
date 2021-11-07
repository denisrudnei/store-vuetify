import ggl from 'graphql-tag'

export const GetSiteSettings = ggl`
query {
  GetSiteSettings {
    id
    name
    address
    cnpj
    logo
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
