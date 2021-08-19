import { registerEnumType } from 'type-graphql'

export enum NotificationEvents {
  NEW_NOTIFICATION = 'NEW_NOTIFICATION',
}

registerEnumType(NotificationEvents, {
  name: 'NotificationEvents',
})
