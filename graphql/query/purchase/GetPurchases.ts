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
    totalPrice
    totalAmount
  }
}
`
