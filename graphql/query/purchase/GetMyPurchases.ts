import ggl from 'graphql-tag'

export const GetMyPurchases = ggl`
query {
  GetMyPurchases {
    id
    totalAmount
    products {
      data {
        id
        name
        description
        primaryImage
      }
    }
  }
}
`
