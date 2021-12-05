import { registerEnumType } from 'type-graphql'

export enum ProductType {
  ECOMMERCE = 'ECOMMERCE',
  RESTAURANT = 'RESTAURANT',
  POS = 'POS',
}

registerEnumType(ProductType, {
  name: 'ProductType',
})
