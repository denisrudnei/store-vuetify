import ggl from 'graphql-tag'

export const ReadNotification = ggl`
mutation ReadNotification($id: ID!) {
  ReadNotification(id: $id)
}
`
