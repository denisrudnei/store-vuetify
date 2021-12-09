import ggl from 'graphql-tag'

export const GetProductInfo = ggl`
query {
  GetAllCategories(withNoProducts: true) {
    id
    name
  }
  GetProducts {
    id
    name
    barcode
    description
    price
    amount
    type
    category {
      id
      name
    }
  }
}
`
