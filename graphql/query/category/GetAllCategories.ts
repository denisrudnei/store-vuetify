import ggl from 'graphql-tag'

export const GetAllCategories = ggl`
query GetAllCategories ($withNoProducts: Boolean) {
  GetAllCategories (withNoProducts: $withNoProducts) {
    id
    name
    description
    slug
    image
  }
}
`
