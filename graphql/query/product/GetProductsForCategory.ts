import ggl from 'graphql-tag'

export const GetProductsForCategory = ggl`
query GetProductsForCategory($name: String!) {
  GetProductsForCategory(name: $name) {
    id
    name
    price
  }
}
`
