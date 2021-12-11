import { registerEnumType } from 'type-graphql'

export enum SynchronizationItemType {
  PRODUCT = 'PRODUCT',
  USER = 'USER',
  CATEGORY = 'CATEGORY',
}

registerEnumType(SynchronizationItemType, {
  name: 'SynchronizationItemType',
})
