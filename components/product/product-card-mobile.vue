<template>
  <v-card>
    <v-card-text>
      <v-tooltip bottom>
        <template #activator="{ on }">
          <h3
            class="text-h4 font-weight-light primary--text text-truncate"
            v-on="on"
          >
            <nuxt-link
              :to="`/categories/${product.category.slug}/product/${product.id}`"
            >
              {{ product.name }}
            </nuxt-link>
          </h3>
        </template>
        <p>{{ product.name }}</p>
      </v-tooltip>
    </v-card-text>
    <v-divider />
    <v-card-text>
      <v-row align="center" justify="center">
        <v-col sm="8" cols="6">
          <nuxt-link
            :to="`/categories/${product.category.slug}/product/${product.id}`"
          >
            <v-img :src="product.primaryImage" height="150" contain>
              <template #placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="grey lighten-5" />
                </v-row>
              </template>
            </v-img>
          </nuxt-link>
        </v-col>
        <v-divider vertical />
        <v-col sum="4" cols="6" align="center">
          <v-btn
            elevation="0"
            large
            tile
            outlined
            block
            class="ma-2"
            :to="`/categories/${product.category.slug}/product/${product.id}`"
          >
            {{ product.price | dinero }}
          </v-btn>
          <v-btn
            v-if="!hideCart"
            fab
            large
            elevation="0"
            outlined
            :color="inCart(product) ? 'red' : 'primary'"
            class="white--text center-text ma-2"
            @click="addToCart(product)"
          >
            <v-icon>{{ icons.mdiCart }}</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-row align="center">
        <v-col cols="12">
          <v-divider />
        </v-col>
        <v-col cols="12">
          <template v-if="!hideCategory">
            <v-chip
              :to="`/categories/${product.category.slug}`"
              label
              class="primary white--text text-truncate"
            >
              {{ product.category.name }}
            </v-chip>
          </template>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mdiCart } from '@mdi/js'
export default {
  props: {
    hideCart: {
      type: Boolean,
      default: false,
    },
    hideCategory: {
      type: Boolean,
      default: false,
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
      this.$toast.show('Added in cart', {
        duration: 1000,
      })
    },
    inCart(item) {
      return this.cart.map((item) => item.id).includes(item.id)
    },
  },
}
</script>

<style scoped>
a {
  text-decoration: none !important;
}
</style>
