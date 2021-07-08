import ggl from 'graphql-tag'

export const DeleteProduct = ggl`
mutation DeleteProduct($id: ID!) {
  DeleteProduct(id: $id)
}
`
