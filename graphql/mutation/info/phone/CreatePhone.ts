import ggl from 'graphql-tag'

export const CreatePhone = ggl`
mutation CreatePhone($phone: CreatePhoneInput!) {
  CreatePhone(phone: $phone) {
    id
    description
    number
  }
}
`
