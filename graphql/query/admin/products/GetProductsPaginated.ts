import ggl from 'graphql-tag'

export const GetProductsPaginated = ggl`
query GetProductsPaginated($page: Int!) {
  GetProductsPaginated(page: $page) {
    edges {
      node {
        id
        name
        barcode
        description
        price
        amount
        type
        category {
          id
          name
        }
      }
    }
    total
    pageInfo {
      page
      pages
    }
  }
}
`
