import { registerEnumType } from 'type-graphql'

export enum ItemType {
  COUNT = 'COUNT',
  PRICE = 'PRICE',
}

registerEnumType(ItemType, {
  name: 'ItemType',
})
