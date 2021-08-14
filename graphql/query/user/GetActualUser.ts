import ggl from 'graphql-tag'

export const GetActualUser = ggl`
query {
  GetActualUser {
    id
    name
    email
    image
    phones {
      id
      description
      number
    }
    addresses {
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
}
`
