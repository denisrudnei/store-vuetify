import { registerEnumType } from 'type-graphql'

export enum EstablishmentTableEvents {
  STATUS_UPDATED = 'STATUS_UPDATED',
  NEW_TABLE = 'NEW_TABLE',
  TABLE_RESERVED = 'TABLE_RESERVED',
  TABLE_REMOVED = 'TABLE_REMOVED',
  NEW_NOTIFICATION_FROM_TABLE = 'NEW_NOTIFICATION_FROM_TABLE',
}

registerEnumType(EstablishmentTableEvents, {
  name: 'EstablishmentTableEvents',
})
