import ggl from 'graphql-tag'

export const ReactivateProducts = ggl`
mutation ReactivateProducts($ids: [ID!]!) {
  ReactivateProducts(ids: $ids)
}
`
