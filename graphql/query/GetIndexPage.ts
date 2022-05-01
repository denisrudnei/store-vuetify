import ggl from 'graphql-tag'

export const GetIndexPage = ggl`
query GetIndexPage ($page: Int, $limit: Int){
  GetCategories(page: $page, limit: $limit) {
    total
    pageInfo {
      page
      pages
    }
    edges {
      node {
        id
        image
        name
        description
        slug
      }
    }
  }
  GetSiteSettings {
    id
    name
  }
}
`
