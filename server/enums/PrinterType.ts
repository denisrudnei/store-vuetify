import { registerEnumType } from 'type-graphql'

export enum PrinterType {
  THERMAL = 'THERMAL',
  LASER = 'LASER',
  LABEL = 'LABEL',
  NETWORK = 'NETWORK',
}

registerEnumType(PrinterType, {
  name: 'PrinterType',
})
