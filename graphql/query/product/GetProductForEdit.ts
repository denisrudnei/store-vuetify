import ggl from 'graphql-tag'

export const GetProductForEdit = ggl`
query GetProduct($id: ID!) {
  GetProductForEdit: GetProduct (id: $id) {
    id
    name
    images
    amount
    type
    category {
      id
      name
    }
    description
    price
  }
}
`
