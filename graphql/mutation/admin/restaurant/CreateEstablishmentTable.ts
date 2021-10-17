import ggl from 'graphql-tag'

export const CreateEstablishmentTable = ggl`
mutation CreateEstablishmentTable($table: CreateEstablishmentTableInput!) {
  CreateEstablishmentTable(table: $table) {
    id
    name
  }
}
`
