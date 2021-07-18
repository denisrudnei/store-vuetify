import ggl from 'graphql-tag'

export const GetProduct = ggl`
query GetProduct($id: ID!) {
  GetProduct (id: $id) {
    id
    name
    category {
      id
      fullName
    }
    description
    ogDescription
    price
  }
}
`
