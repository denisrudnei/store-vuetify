import ggl from 'graphql-tag'

export const ReactivateProduct = ggl`
mutation ReactivateProduct($id: ID!) {
  ReactivateProduct(id: $id)
}
`
