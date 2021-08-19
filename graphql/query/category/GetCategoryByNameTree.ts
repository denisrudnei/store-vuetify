import ggl from 'graphql-tag'

export const GetCategoryByNameTree = ggl`
query GetCategoryByNameTree($name: String!) {
  GetCategoryByNameTree: GetCategoryByName(name: $name) {
    id
    name
    slug
    subCategories {
      id
      name
      slug
      subCategories {
        id
        name
        slug
      }
    }
  }
}
`
