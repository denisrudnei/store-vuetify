import { registerEnumType } from 'type-graphql'

export enum ProductEvents {
  PRODUCT_UPDATED = 'PRODUCT_UPDATED',
}

registerEnumType(ProductEvents, {
  name: 'ProductEvents',
})
