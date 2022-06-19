import { registerEnumType } from 'type-graphql'

export enum PrinterType {
  THERMAL = 'THERMAL',
  LASER = 'LASER',
  LABEL = 'LABEL',
  NETWORK = 'NETWORK',
  BLUETOOTH = 'BLUETOOTH',
  BUILT_IN = 'BUILT_IN',
}

registerEnumType(PrinterType, {
  name: 'PrinterType',
})
