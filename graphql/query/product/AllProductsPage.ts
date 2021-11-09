import ggl from 'graphql-tag'

export const AllProductsPage = ggl`
query AllProductsPage($search: SearchProductInput!) {
  SearchProducts(search: $search) {
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
