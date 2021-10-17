import { registerEnumType } from 'type-graphql'

export enum PurchaseType {
  DELIVERY = 'DELIVERY',
  NORMAL = 'NORMAL',
  RESTAURANT_ORDER = 'RESTAURANT_ORDER',
}

registerEnumType(PurchaseType, {
  name: 'PurchaseType',
})
