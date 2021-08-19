import ggl from 'graphql-tag'

export const NewNotification = ggl`
subscription {
  NewNotification {
    id
    content
    origin
    date
  }
}
`
