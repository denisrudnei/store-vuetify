import ggl from 'graphql-tag'

export const RemovePOS = ggl`
mutation RemovePOS($id: ID!) {
  RemovePOS(id: $id)
}
`
