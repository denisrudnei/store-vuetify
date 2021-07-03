import ggl from 'graphql-tag'

export const GetCategories = ggl`
query {
  GetCategories {
    id
    name
    description
  }
}
`
