import { registerEnumType } from 'type-graphql'

export enum PrintLayoutItemType {
  FILL_THE_LINE = 'FILL_THE_LINE',
  COLUMNS = 'COLUMNS',
}

registerEnumType(PrintLayoutItemType, {
  name: 'PrintLayoutItemType',
})
