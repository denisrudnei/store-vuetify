import ggl from 'graphql-tag'

export const AllProductsPage = ggl`
query AllProductsPage($search: SearchProductInput!) {
  SearchProducts(search: $search) {
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
`
