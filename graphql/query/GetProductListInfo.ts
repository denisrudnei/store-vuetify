import ggl from 'graphql-tag'

export const GetProductInfo = ggl`
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
    amount
    category {
      id
      name
    }
  }
}
`
