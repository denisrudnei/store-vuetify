import ggl from 'graphql-tag'

export const GetActualUser = ggl`
query {
  GetActualUser {
    id
    name
    email
  }
}
`