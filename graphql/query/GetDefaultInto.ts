import ggl from 'graphql-tag'

export const GetDefaultInfo = ggl`
query {
  GetCategories {
    id
    name
    description
    slug
  }
  GetSiteSettings {
    id
    name
    logo
    currency
    locale
    adSense
  }
  GetSocialNetworks {
    id
    facebook
    twitter
    youtube
    discord
  }
}
`
