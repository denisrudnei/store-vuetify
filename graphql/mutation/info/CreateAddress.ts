import ggl from 'graphql-tag'

export const CreateAddress = ggl`
mutation CreateAddress ($address: CreateAddressInput!) {
  CreateAddress(address: $address) {
    id
    street
    number
    city
    country
    district
    state
    zipCode
  }
}
`
