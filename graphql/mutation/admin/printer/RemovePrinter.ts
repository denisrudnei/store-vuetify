import ggl from 'graphql-tag'

export const RemovePrinter = ggl`
mutation RemovePrinter($id: ID!) {
  RemovePrinter(id: $id)
}
`
