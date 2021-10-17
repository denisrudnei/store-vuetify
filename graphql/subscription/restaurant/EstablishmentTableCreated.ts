import ggl from 'graphql-tag'

export const EstablishmentTableCreated = ggl`
subscription {
  EstablishmentTableCreated {
    id
    name
    inUse
  }
}
`
