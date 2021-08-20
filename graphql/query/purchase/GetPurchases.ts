import ggl from 'graphql-tag'

export const GetPurchases = ggl`
query {
  GetPurchases {
    id
    createdAt
    user {
      id
      name
      image
    }
    type
    status
    payment {
      id
      change
    }
    totalPrice
    totalAmount
  }
}
`
