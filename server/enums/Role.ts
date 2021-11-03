import { registerEnumType } from 'type-graphql'

export enum Role {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
  USER = 'USER',
}

registerEnumType(Role, {
  name: 'Role',
})
