import ggl from 'graphql-tag'

export const AllProductsPage = ggl`
query AllProductsPage($search: SearchProductInput!, $page: Int) {
  SearchProducts(search: $search, page: $page, limit: 12) {
    edges {
      node {
        id
        name
        description
        price
        primaryImage
        category {
          id
          name
          slug
        }
      }
    }
    pageInfo {
      pages
      page
    }
  }
}
`
