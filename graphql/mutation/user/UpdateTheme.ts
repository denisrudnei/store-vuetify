import ggl from 'graphql-tag'

export const UpdateTheme = ggl`
mutation UpdateTheme($isDark: Boolean!) {
  UpdateTheme(isDark: $isDark) {
    id
  }
}
`
