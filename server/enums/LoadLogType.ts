import { registerEnumType } from 'type-graphql'

export enum LoadLogType {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

registerEnumType(LoadLogType, {
  name: 'LoadLogType',
})
