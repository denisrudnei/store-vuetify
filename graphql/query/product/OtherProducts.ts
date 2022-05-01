import ggl from 'graphql-tag'

export const OtherProducts = ggl`
query {
  GetProducts(limit: 50) {
    id
    name
    description
    price
    primaryImage
    category {
      id
      slug
      name
    }
  }
}
`
