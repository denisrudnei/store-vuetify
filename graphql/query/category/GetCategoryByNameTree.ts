import ggl from 'graphql-tag'

export const GetCategoryByNameTree = ggl`
query GetCategoryByNameTree($name: String!, $allTypes: Boolean) {
  GetCategoryByNameTree: GetCategoryByName(name: $name) {
    id
    name
    slug
    subCategories(allTypes: $allTypes) {
      id
      name
      slug
      subCategories(allTypes: $allTypes) {
        id
        name
        slug
      }
    }
  }
}
`
