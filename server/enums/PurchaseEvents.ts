import { registerEnumType } from 'type-graphql'

export enum PurchaseEvents {
  NEW_PURCHASE = 'NEW_PURCHASE',
}

registerEnumType(PurchaseEvents, {
  name: 'PurchaseEvents',
})
