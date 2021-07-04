import ggl from 'graphql-tag'

export const InactivateProduct = ggl`
mutation InactivateProduct($id: ID!) {
  InactivateProduct(id: $id)
}
`
