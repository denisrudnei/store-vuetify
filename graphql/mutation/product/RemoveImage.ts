import ggl from 'graphql-tag'

export const RemoveImage = ggl`
mutation RemoveImage($product: ID!, $image: String!) {
  RemoveImage(product: $product, image: $image)
}
`
