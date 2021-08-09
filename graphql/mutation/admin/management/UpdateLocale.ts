import ggl from 'graphql-tag'

export const UpdateLocale = ggl`
mutation UpdateLocale($locale: String!) {
  UpdateLocale(locale: $locale)
}
`
