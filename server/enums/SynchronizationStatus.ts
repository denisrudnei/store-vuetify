import { registerEnumType } from 'type-graphql'

export enum SynchronizationStatus {
  SYNCHRONIZED = 'SYNCHRONIZED',
  UNSYNCHRONIZED = 'UNSYNCHRONIZED',
  CONFLICT = 'CONFLICT',
}

registerEnumType(SynchronizationStatus, {
  name: 'SynchronizationStatus',
})
