import ggl from 'graphql-tag'

export const UpdateUserInfo = ggl`
mutation UpdateUserInfo($user: UpdateUserInfoInput!) {
  UpdateUserInfo(user: $user) {
    id
    name
  }
}
`
