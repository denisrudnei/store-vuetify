import ggl from 'graphql-tag'

export const GetPurchase = ggl`
query GetPurchase ($id: ID!) {
  GetPurchase (id: $id) {
    id
    products {
      data {
        id
        name
        price
        amount
      }
    }
    createdAt
  }
}
`
