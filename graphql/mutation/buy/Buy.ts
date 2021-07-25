import ggl from 'graphql-tag'

export const Buy = ggl`
mutation Buy($products: [ProductForPurchaseInput!]!) {
  Buy(products: $products) {
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
