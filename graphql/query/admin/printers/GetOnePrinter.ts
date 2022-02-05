import ggl from 'graphql-tag'

export const GetOnePrinter = ggl`
query GetOnePrinter($id: ID!) {
  GetOnePrinter(id: $id) {
    id
    name
    path
    manufacturer
    model
    type
    installedIn {
      id
      name
      createdAt
    }
  }
}
`
