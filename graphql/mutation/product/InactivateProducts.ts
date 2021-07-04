import ggl from 'graphql-tag'

export const InactivateProducts = ggl`
mutation InactivateProducts($ids: [ID!]!) {
  InactivateProducts(ids: $ids)
}
`
