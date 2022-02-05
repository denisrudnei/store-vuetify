import ggl from 'graphql-tag'

export const UpdatePrinter = ggl`
mutation UpdatePrinter($id: ID!, $printer: UpdatePrinterInput!) {
  UpdatePrinter(id: $id, printer: $printer) {
    id
    name
    path
    manufacturer
    model
    installedIn {
      id
      name
    }
  }
}
`
