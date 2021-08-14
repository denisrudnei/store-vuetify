import ggl from 'graphql-tag'

export const RemovePhone = ggl`
mutation RemovePhone($id: ID!) {
  RemovePhone(id: $id)
}
`
