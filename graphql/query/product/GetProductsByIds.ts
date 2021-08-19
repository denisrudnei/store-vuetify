import ggl from 'graphql-tag'

export const GetProductsByIds = ggl`
query GetProductsByIds ($ids: [ID!]!) {
  GetProductsByIds(ids: $ids) {
    id
    name
    price
    primaryImage
  }
}
`
