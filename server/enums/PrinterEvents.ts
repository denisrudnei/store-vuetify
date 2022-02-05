import { registerEnumType } from 'type-graphql'

export enum PrinterEvents {
  NEW_PRINTER = 'NEW_PRINTER',
  PRINTER_UPDATED = 'PRINTER_UPDATED',
}

registerEnumType(PrinterEvents, {
  name: 'PrinterEvents',
})
