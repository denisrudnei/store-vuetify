import ggl from 'graphql-tag'

export const AllProductsPage = ggl`
query {
  GetAllCategories {
    id
    name
  }
  GetProducts {
    id
    name
    description
    price
    category {
      id
      name
      slug
    }
  }
}
`
