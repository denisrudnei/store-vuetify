import ggl from 'graphql-tag'

export const UpdateCategoryForProducts = ggl`
mutation UpdateCategoryForProducts($products: [ID!]!, $category: ID!) {
  UpdateCategoryForProducts(products: $products, category: $category)
}
`
