import ggl from 'graphql-tag'

export const GetPurchase = ggl`
query GetPurchase ($id: ID!) {
  GetPurchase (id: $id) {
    id
    products {
      productId
      data {
        id
        name
        price
        amount
        primaryImage
      }
    }
    totalPrice
    totalAmount
    createdAt
  }
}
`
