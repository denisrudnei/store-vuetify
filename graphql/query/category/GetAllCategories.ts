import ggl from 'graphql-tag'

export const GetAllCategories = ggl`
query {
  GetAllCategories {
    id
    name
    description
    slug
    image
  }
}
`
