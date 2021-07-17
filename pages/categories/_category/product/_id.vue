<template>
  <show-product :product="product" />
</template>

<script>
import { GetProduct } from '../../../../graphql/query/product/GetProduct'
import showProduct from '~/components/product/show-product.vue'
import productPage from '~/mixins/product-page'
export default {
  components: { showProduct },
  auth: false,
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
        return {
          product: response.data.GetProduct,
        }
      })
      .catch(() => {
        error({ statusCode: 404, message: 'Product not found' })
      })
  },
}
</script>

<style></style>
