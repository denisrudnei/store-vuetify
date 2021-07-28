import ggl from 'graphql-tag'

export const GetSummary = ggl`
query {
  GetSummary {
    name
    value
  }
}
`
