import ggl from 'graphql-tag'

export const GetTable = ggl`
query GetTable($id: ID!){
  GetTable(id: $id) {
    id
    name
    inUse
  }
}
`
