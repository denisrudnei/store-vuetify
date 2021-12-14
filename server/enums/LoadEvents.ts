import { registerEnumType } from 'type-graphql'

export enum LoadEvents {
  ITEM_SYNCHRONIZED = 'ITEM_SYNCHRONIZED',
  LOAD_FINISHED = 'LOAD_FINISHED',
  PRODUCTS_SYNCHRONIZED = 'PRODUCTS_SYNCHRONIZED',
  CATEGORIES_SYNCHRONIZED = 'CATEGORIES_SYNCHRONIZED',
  USERS_SYNCHRONIZED = 'USERS_SYNCHRONIZED',
}

registerEnumType(LoadEvents, {
  name: 'LoadEvents',
})