import ggl from 'graphql-tag'

export const GetAllCategories = ggl`
query GetAllCategories ($withNoProducts: Boolean) {
  GetAllCategories (withNoProducts: $withNoProducts) {
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
        productsTypes
      }
    }
  }
}
`
