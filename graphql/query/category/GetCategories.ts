import ggl from 'graphql-tag'

export const GetCategories = ggl`
query GetCategories($page: Int, $limit: Int) {
  GetCategories (page: $page, limit: $limit) {
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
      }
    }
  }
}
`
