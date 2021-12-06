import { ProductType } from '../enums/ProductType'

export function convertProductTypesToPostgresString(types: ProductType[]) {
  return `'{${types.join(',')}}'`
}
