import ggl from 'graphql-tag'

export const CreatePrinter = ggl`
mutation CreatePrinter($printer: CreatePrinterInput!) {
  CreatePrinter(printer: $printer) {
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
