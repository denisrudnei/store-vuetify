import ggl from 'graphql-tag'

export const EditCategory = ggl`
mutation EditCategory($id: ID!, $category: EditCategoryInput!) {
  EditCategory(id: $id, category: $category) {
    id
    name
    description
    father {
      id
      name
      description
    }
  }
}
`
