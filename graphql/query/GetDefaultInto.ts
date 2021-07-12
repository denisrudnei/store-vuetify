import ggl from 'graphql-tag'

export const GetDefaultInfo = ggl`
query {
  GetCategories {
    id
    name
    description
    slug
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