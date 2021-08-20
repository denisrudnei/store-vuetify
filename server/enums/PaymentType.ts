import { registerEnumType } from 'type-graphql'

export enum PaymentType {
  MONEY = 'MONEY',
  CARD = 'CARD',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
}

registerEnumType(PaymentType, {
  name: 'PaymentType',
})
