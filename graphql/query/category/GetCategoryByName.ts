import ggl from 'graphql-tag'

export const GetCategoryByName = ggl`
query GetCategoryByName($name: String!, $page: Int) {
  GetCategoryByName(name: $name) {
    id
    name
    slug
    fullName
    description
    image
    father {
      name
      id
      slug
      subCategories {
        total
        pageInfo {
          page
          pages
        }
        edges {
          node {
            id
            name
            slug
          }
        }
      }
    }
    subCategories {
      total
      pageInfo {
        page
        pages
      }
      edges {
        node {
          id
          name
          slug
        }
      }
    }
    productsTypes
    productsConnection(limit: 12, page: $page) {
      total
      pageInfo {
        page
        pages
      }
      edges {
        node {
          id
          name
          price
          primaryImage
        }
      }
    }
    products(limit: 12) {
      total
      pageInfo {
        page
        pages
      }
      edges {
        node {
          id
          name
          price
          primaryImage
        }
      }
    }
  }
}
`
