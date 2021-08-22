import ggl from 'graphql-tag'

export const ChangePurchaseStatus = ggl`
mutation ChangePurchaseStatus($id: ID!, $status: DeliveryStatus!) {
  ChangePurchaseStatus(id: $id, status: $status)
}
`
