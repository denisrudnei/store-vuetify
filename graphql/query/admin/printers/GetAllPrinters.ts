import ggl from 'graphql-tag'

export const GetAllPrinters = ggl`
query {
  GetAllPrinters {
    id
    name
    path
    manufacturer
    model
  }
}
`
