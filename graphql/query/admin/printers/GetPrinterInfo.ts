import ggl from 'graphql-tag'

export const GetPrinterInfo = ggl`
query {
  GetPrinterTypes
  GetPOS {
    id
    name
  }
}
`
