<template>
  <div>
    <h4 class="text-h4">Other products</h4>
    <v-sheet elevation="0" class="mx-auto">
      <v-slide-group class="pa-1" show-arrows>
        <v-slide-item v-for="product in products" :key="product.id">
          <v-card :width="isMobile ? 250 : 400" class="ma-2">
            <product-card :product="product" hide-cart />
          </v-card>
        </v-slide-item>
      </v-slide-group>
    </v-sheet>
  </div>
</template>

<script>
import { OtherProducts } from '../graphql/query/product/OtherProducts'
import theme from '~/mixins/theme'
export default {
  mixins: [theme],
  data() {
    return {
      products: [],
    }
  },
  created() {
    this.$apollo
      .query({
        query: OtherProducts,
      })
      .then((response) => {
        this.products = response.data.GetProducts
      })
  },
}
</script>

<style></style>
