import ggl from 'graphql-tag'

export const EstablishmentTableStatusChanged = ggl`
subscription {
  EstablishmentTableStatusChanged {
    id
    name
    inUse
  }
}

`
