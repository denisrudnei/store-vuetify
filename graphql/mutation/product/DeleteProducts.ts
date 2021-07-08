import ggl from 'graphql-tag'

export const DeleteProducts = ggl`
mutation DeleteProducts($ids: [ID!]!) {
  DeleteProducts (ids: $ids) {
    id
    deleted
  }
}
`
