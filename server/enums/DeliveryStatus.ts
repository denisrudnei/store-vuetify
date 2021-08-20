import { registerEnumType } from 'type-graphql'

export enum DeliveryStatus {
  REQUIRED = 'REQUIRED',
  IN_PRODUCTION = 'IN_PRODUCTION',
  DELIVERY_PROCESS = 'DELIVERY_PROCESS',
  DELIVERED = 'DELIVERED',
}

registerEnumType(DeliveryStatus, {
  name: 'DeliveryStatus',
})
