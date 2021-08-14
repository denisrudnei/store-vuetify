import ggl from 'graphql-tag'

export const UpdateAddress = ggl`
mutation UpdateAddress($address: UpdateAddressInput!) {
  UpdateAddress(address: $address) {
    id
    fullName
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
