import { registerEnumType } from 'type-graphql'

export enum NotificationOrigin {
  USER = 'USER',
  SYSTEM = 'SYSTEM',
}

registerEnumType(NotificationOrigin, {
  name: 'NotificationOrigin',
})
