import ggl from 'graphql-tag'

export const GetAllCategories = ggl`
query GetAllCategories ($withNoProducts: Boolean, $page: Int, $limit: Int) {
  GetAllCategories (withNoProducts: $withNoProducts, page: $page, limit: $limit) {
    total
    pageInfo {
      page
      pages
    }
    edges {
      node {
        id
        name
        description
        slug
        image
      }
    }
  }
}
`
