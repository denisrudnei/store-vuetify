import ggl from 'graphql-tag'

export const CreateProduct = ggl`
mutation CreateProduct($product: CreateProductInput!) {
  CreateProduct (product: $product) {
    id
    name
    description
    price
  }
}
`
