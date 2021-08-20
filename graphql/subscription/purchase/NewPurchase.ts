import ggl from 'graphql-tag'

export const NewPurchase = ggl`
subscription {
  NewPurchase {
    id
    createdAt
    totalPrice
    totalAmount
    type
    status
    payment {
      id
      change
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
