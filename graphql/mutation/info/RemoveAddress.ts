import ggl from 'graphql-tag'

export const RemoveAddress = ggl`
mutation RemoveAddress($id: ID!) {
  RemoveAddress(id: $id)
}
`
