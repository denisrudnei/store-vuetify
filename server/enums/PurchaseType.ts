import { registerEnumType } from 'type-graphql'

export enum PurchaseType {
  DELIVERY = 'DELIVERY',
  NORMAL = 'NORMAL',
}

registerEnumType(PurchaseType, {
  name: 'PurchaseType',
})
