import ggl from 'graphql-tag'

export const ToggleAdSense = ggl`
mutation ToggleAdSense ($status: Boolean!) {
  ToggleAdSense(status: $status)
}
`
