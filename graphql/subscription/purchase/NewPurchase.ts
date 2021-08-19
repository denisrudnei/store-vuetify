import ggl from 'graphql-tag'

export const NewPurchase = ggl`
subscription {
  NewPurchase {
    id
    createdAt
    totalPrice
    totalAmount
    user {
      id
      name
      image
    }
    products {
      data {
        id
        name
        primaryImage
      }
    }
  }
}
`
