import ggl from 'graphql-tag'

export const GetSocialNetworks = ggl`
query {
  GetSocialNetworks {
    id
    facebook
    youtube
    twitter
    discord
  }
}
`
