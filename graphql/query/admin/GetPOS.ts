import ggl from 'graphql-tag'
export const GetPOS = ggl`
query {
  GetPOS {
    id
    name
    hostname
  }
}
`
