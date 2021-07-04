import ggl from 'graphql-tag'

export const CreateCategory = ggl`
mutation CreateCategory($category: CreateCategoryInput!) {
  CreateCategory(category: $category) {
    id
    name
    description
  }
}
`
