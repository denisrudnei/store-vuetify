import { registerEnumType } from 'type-graphql'

export enum PurchaseEvents {
  NEW_PURCHASE = 'NEW_PURCHASE',
  DELIVERY_STATUS_UPDATED = 'DELIVERY_STATUS_UPDATED',
}

registerEnumType(PurchaseEvents, {
  name: 'PurchaseEvents',
})
