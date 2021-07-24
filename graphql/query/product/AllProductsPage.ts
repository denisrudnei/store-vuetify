import ggl from 'graphql-tag'

export const AllProductsPage = ggl`
query AllProductsPage($search: SearchProductInput!) {
  SearchProducts(search: $search) {
    id
    name
    description
    price
    images
    category {
      id
      name
      slug
    }
  }
}
`
