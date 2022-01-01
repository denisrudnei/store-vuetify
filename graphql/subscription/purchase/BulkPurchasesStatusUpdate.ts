import ggl from 'graphql-tag'

export const BulkPurchasesStatusUpdate = ggl`
subscription {
  BulkPurchasesStatusUpdate {
    id
    status
  }
}
`
