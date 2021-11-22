import ggl from 'graphql-tag'

export const GetProductInfo = ggl`
query {
  GetAllCategories(withNoProducts: true) {
    id
    name
  }
  GetProducts(limit: 12) {
    id
    name
    description
    price
    amount
    category {
      id
      name
    }
  }
}
`
