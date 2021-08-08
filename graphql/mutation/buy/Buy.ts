import ggl from 'graphql-tag'

export const Buy = ggl`
mutation Buy($products: [ProductForPurchaseInput!]!, $nonce: String!, $deviceData: String!) {
  Buy(products: $products, nonce: $nonce, deviceData: $deviceData) {
    id
    products {
      data {
        id
        name
        amount
      }
    }
  }
}
`
