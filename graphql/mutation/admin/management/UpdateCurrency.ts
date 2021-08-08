import ggl from 'graphql-tag'

export const UpdateCurrency = ggl`
mutation UpdateCurrency($currency: String!) {
  UpdateCurrency(currency: $currency)
}
`
