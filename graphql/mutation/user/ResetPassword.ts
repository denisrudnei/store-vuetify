import ggl from 'graphql-tag'

export const ResetPassword = ggl`
mutation ResetPassword($newPassword: String!) {
  ResetPassword(newPassword: $newPassword) {
    id
  }
}
`
