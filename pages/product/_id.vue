<template>
  <show-product :product="product" />
</template>

<script>
import { GetProduct } from '../../graphql/query/product/GetProduct'
import ShowProduct from '~/components/product/show-product.vue'
export default {
  components: {
    ShowProduct,
  },
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
  head() {
    return {
      title: this.product.name,
      meta: [
        {
          hid: 'og:image',
          property: 'og:image',
          content: 'https://picsum.photos/800/600/',
        },
        {
          hid: 'og:type',
          property: 'og:type',
          content: 'og:product',
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.product.name,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.product.description,
        },
        {
          hid: 'product:price:amount',
          property: 'product:price:amount',
          content: this.product.price,
        },
        {
          hid: 'product:price:currency',
          property: 'product:price:currency',
          content: 'BRL',
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `product/${this.product.id}`,
        },
      ],
    }
  },
}
</script>

<style></style>
