import ggl from 'graphql-tag'

export const purchaseFragment = ggl`
fragment purchaseFragment on Purchase {
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
    type
  }
  totalPrice
  totalAmount
}
`
