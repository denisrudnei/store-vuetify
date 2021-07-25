import ggl from 'graphql-tag'

export const GetIndexPage = ggl`
query {
  GetCategories {
    id
    name
    description
    slug
    image
  }
  GetSiteSettings {
    id
    name
  }
}
`
