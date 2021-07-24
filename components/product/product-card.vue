<template>
  <div>
    <v-card v-if="!isMobile" :elevation="elevation">
      <nuxt-link
        :to="`/categories/${product.category.slug}/product/${product.id}`"
      >
        <v-img :src="'/images/not-set.svg'" :aspect-ratio="16 / 9">
          <template #placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="grey lighten-5" />
            </v-row>
          </template>
        </v-img>
      </nuxt-link>
      <v-card-text style="position: relative">
        <v-btn
          v-if="!hideCart"
          absolute
          :color="inCart(product) ? 'red' : 'primary'"
          fab
          large
          right
          top
          class="white--text"
          @click="addToCart(product)"
        >
          <v-icon>{{ icons.mdiCart }}</v-icon>
        </v-btn>
        <h3 class="text-h4 font-weight-light primary--text mb-2">
          {{ product.name }}
        </h3>
        <span class="text-h6">$ {{ product.price }}</span>
        <template v-if="!hideCategory">
          <v-divider class="pt-2 pb-4" />
          <v-chip
            :to="`/categories/${product.category.slug}`"
            label
            class="primary white--text"
          >
            {{ product.category.name }}
          </v-chip>
        </template>
      </v-card-text>
    </v-card>
    <product-card-mobile v-if="isMobile" :product="product" />
  </div>
</template>

<script>
import { mdiCart } from '@mdi/js'
import theme from '~/mixins/theme'
export default {
  mixins: [theme],
  props: {
    hideCart: {
      type: Boolean,
      default: false,
    },
    hideCategory: {
      type: Boolean,
      default: false,
    },
    elevation: {
      type: Number,
      default: 2,
    },
    product: {
      type: Object,
      default: () => ({
        name: '',
        price: 0,
        description: '',
      }),
    },
  },
  computed: {
    icons() {
      return {
        mdiCart,
      }
    },
    cart: {
      get() {
        return this.$store.getters['products/getCart']
      },
    },
  },
  methods: {
    addToCart(product) {
      this.$store.commit('products/addToCart', product)
    },
    inCart(item) {
      return this.cart.map((item) => item.id).includes(item.id)
    },
  },
}
</script>

<style></style>
