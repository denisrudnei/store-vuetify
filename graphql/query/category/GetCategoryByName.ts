import ggl from 'graphql-tag'

export const GetCategoryByName = ggl`
query GetCategoryByName($name: String!) {
  GetCategoryByName(name: $name) {
    id
    name
    slug
    fullName
    description
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
    products {
      id
      name
      price
    }
  }
}
`
