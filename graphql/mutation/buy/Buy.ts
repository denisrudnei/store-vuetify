import ggl from 'graphql-tag'

export const Buy = ggl`
mutation Buy($type: PurchaseType!, $payment: PaymentInput!, $products: [ProductForPurchaseInput!]!, $nonce: String!, $deviceData: String!) {
  Buy(type: $type, payment: $payment, products: $products, nonce: $nonce, deviceData: $deviceData) {
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
