import ggl from 'graphql-tag'

export const GetProducts = ggl`
query {
  GetProducts {
    id
    name
    barcode
    description
    price
  }
}
`
