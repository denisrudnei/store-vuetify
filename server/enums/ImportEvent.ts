import { registerEnumType } from 'type-graphql'

export enum ImportEvents {
  productImported = 'productImported',
}

registerEnumType(ImportEvents, {
  name: 'ImportEvents',
})
