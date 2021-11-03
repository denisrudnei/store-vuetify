import ggl from 'graphql-tag'

export const NewPurchase = ggl`
subscription {
  NewPurchase {
    id
    createdAt
    origin
    totalPrice
    totalAmount
    type
    status
    payment {
      id
      change
      type
    }
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
