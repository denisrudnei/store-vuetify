import ggl from 'graphql-tag'

export const OtherProducts = ggl`
query {
  GetProducts {
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
