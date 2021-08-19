import ggl from 'graphql-tag'

export const GetNotifications = ggl`
query {
  GetNotifications {
    id
    origin
    content
    date
    user {
      id
      name
    }
  }
}
`
