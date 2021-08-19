import ggl from 'graphql-tag'

export const GetAllNotifications = ggl`
query {
  GetAllNotifications {
    id
    content
    read
    user {
      id
      name
    }
    date
  }
}
`
