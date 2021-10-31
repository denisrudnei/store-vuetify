import { registerEnumType } from 'type-graphql'

export enum Locale {
  EN_US = 'EN_US',
  PT_BR = 'PT_BR',
}

registerEnumType(Locale, {
  name: 'Locale',
})
