import ggl from 'graphql-tag'

export const GetCategoryTree = ggl`
query {
  GetCategories {
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
        subCategories(allTypes: true) {
          id
          name
        }
      }
    }
  }
}
`
