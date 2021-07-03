import ggl from 'graphql-tag'

export const GetProducts = ggl`
query {
  GetProducts {
    id
    name
    description
    price
  }
}
`
