import ggl from 'graphql-tag'

export const EditSocialNetworks = ggl`
mutation EditSocialNetworks($socialNetworks: EditSocialNetworksInput!) {
  EditSocialNetworks(socialNetworks: $socialNetworks) {
    id
    facebook
    youtube
    twitter
    discord
  }
}
`
