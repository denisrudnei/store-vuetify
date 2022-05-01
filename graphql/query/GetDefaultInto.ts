import ggl from 'graphql-tag'

export const GetDefaultInfo = ggl`
query {
  GetCategories {
    total
    pageInfo {
      page
      pages
    }
    edges {
      node {
        id
        name
        description
        slug
      }
    }
  }
  GetSiteSettings {
    id
    name
    address
    cnpj
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
