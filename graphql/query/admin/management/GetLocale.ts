import ggl from 'graphql-tag'

export const GetLocale = ggl`
query {
  GetLocale: GetSiteSettings {
    id
    locale
  }
}
`
