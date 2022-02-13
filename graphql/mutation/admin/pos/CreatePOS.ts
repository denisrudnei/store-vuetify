import ggl from 'graphql-tag'

export const CreatePOS = ggl`
mutation CreatePOS($pos: CreatePOSInput!) {
  CreatePOS(pos: $pos) {
    id
    name
  }
}
`
