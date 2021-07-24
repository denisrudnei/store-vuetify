import ggl from 'graphql-tag'

export const GetUsers = ggl`
query {
  GetUsers {
    id
    name
    email
    active
    image
  }
}
`
