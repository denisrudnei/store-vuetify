import ggl from 'graphql-tag'

export const PurchaseStatusUpdated = ggl`
subscription {
  PurchaseStatusUpdated {
    id
    status
  }
}
`
