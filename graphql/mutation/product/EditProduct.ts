import ggl from 'graphql-tag'

export const EditProduct = ggl`
mutation EditProduct ($id: ID!, $product: EditProductInput!) {
  EditProduct (id: $id, product: $product) {
    id
    name
    price
    description
  }
}
`
