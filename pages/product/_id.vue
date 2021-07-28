<template>
  <show-product :product="product" />
</template>

<script>
import { GetProduct } from '../../graphql/query/product/GetProduct'
import ShowProduct from '~/components/product/show-product.vue'
import productPage from '~/mixins/product-page'
export default {
  auth: false,
  components: {
    ShowProduct,
  },
  mixins: [productPage],
  asyncData({ app, error, route }) {
    return app.apolloProvider.defaultClient
      .query({
        query: GetProduct,
        variables: {
          id: route.params.id,
        },
      })
      .then((response) => {
        if (!response.data.GetProduct) {
          return error({ statusCode: 404, message: 'Product not found' })
        }
        return {
          product: response.data.GetProduct,
        }
      })
      .catch(() => {
        error({ statusCode: 500, message: 'Failed to load product' })
      })
  },
}
</script>

<style></style>
