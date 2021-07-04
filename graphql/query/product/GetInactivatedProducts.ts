import ggl from 'graphql-tag'
export const GetInactivatedProducts = ggl`
query {
  GetInactivatedProducts {
    id
    name
    price
    deletedAt
  }
}
`
