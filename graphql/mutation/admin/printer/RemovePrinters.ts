import ggl from 'graphql-tag'

export const RemovePrinters = ggl`
mutation RemovePrinters($ids: [ID!]!) {
  RemovePrinters(ids: $ids)
}
`
