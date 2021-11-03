import { registerEnumType } from 'type-graphql'

export enum PurchaseOrigin {
  ECOMMERCE = 'ECOMMERCE',
  POS = 'POS',
  ESTABLISHMENT_TABLE = 'ESTABLISHMENT_TABLE',
}

registerEnumType(PurchaseOrigin, {
  name: 'PurchaseOrigin',
})
