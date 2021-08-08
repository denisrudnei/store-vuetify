import ggl from 'graphql-tag'

export const GetCurrency = ggl`
query {
  GetCurrency: GetSiteSettings {
    id
    currency
  }
}
`
