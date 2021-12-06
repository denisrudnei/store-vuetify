import ggl from 'graphql-tag'

export const GetCategoryByNameEdit = ggl`
query GetCategoryByName($name: String!) {
  GetCategoryByName(name: $name) {
    id
    name
    slug
    fullName
    description
    image
    father {
      name
      id
      slug
      subCategories {
        id
        name
        slug
      }
    }
    subCategories {
      id
      name
      slug
    }
    productsTypes
  }
}
`
