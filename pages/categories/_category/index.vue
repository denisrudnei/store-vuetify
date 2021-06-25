<template>
  <v-row justify="center" align="center">
    <v-col cols="12">Items: {{ length }}</v-col>
    <v-col v-for="product in products" :key="product.id" cols="12" md="4">
      <v-card>
        <nuxt-link :to="`/categories/${category}/product/${product.id}`">
          <v-img
            :src="`https://picsum.photos/800/600/?${Math.random()}`"
            :aspect-ratio="16 / 9"
          >
            <template #placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </nuxt-link>
        <v-card-title>
          {{ product.name }}
        </v-card-title>
        <v-card-text>
          <span>$ {{ (Math.random() * 100).toFixed(2) }}</span>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            icon
            large
            :color="inCart(product) ? 'red' : 'white'"
            @click="addToCart(product)"
          >
            <v-icon>mdi-cart</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import faker from 'faker'
export default {
  data() {
    return {
      length: undefined,
    }
  },
  computed: {
    cart: {
      get() {
        return this.$store.getters['products/getCart']
      },
    },
    category() {
      return this.$route.params.category
    },
    products() {
      return Array.from({ length: this.length }, (_, x) => (x += 1)).map(
        (item) => ({
          id: item,
          name: faker.commerce.productName(),
          price: faker.commerce.price(),
        })
      )
    },
  },
  watch: {
    $route: {
      deep: true,
      handler() {
        this.length = this.generateLength()
      },
    },
  },
  watchQuery: true,
  beforeUpdate() {
    this.length = this.generateLength()
  },
  created() {
    this.length = this.generateLength()
  },
  methods: {
    generateLength() {
      return Math.floor(Math.random() * 25)
    },
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
