import ggl from 'graphql-tag'

export const GetTables = ggl`
query {
  GetTables {
    id
    name
    inUse
  }
}
`
