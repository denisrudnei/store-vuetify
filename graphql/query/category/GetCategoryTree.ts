import ggl from 'graphql-tag'

export const GetCategoryTree = ggl`
query {
  GetCategories {
    id
    name
    slug
    subCategories(allTypes: true) {
      id
      name
    }
  }
}
`
