<template>
  <div>
    <v-sheet elevation="0">
      <h4 class="text-h4">Other products</h4>
      <v-slide-group show-arrows>
        <v-slide-item v-for="product in products" :key="product.id">
          <v-card
            :width="isMobile ? 250 : 400"
            :class="isMobile ? 'pa-1' : 'ma-2'"
          >
            <product-card :product="product" hide-cart :elevation="0" />
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
