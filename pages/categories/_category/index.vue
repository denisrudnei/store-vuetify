<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <v-card
        :dark="!$vuetify.theme.dark"
        :color="!$vuetify.theme.dark ? 'primary' : undefined"
        flat
      >
        <v-card-text class="title"> Items: {{ length }} </v-card-text>
      </v-card>
    </v-col>
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
        <v-card-text style="position: relative">
          <v-btn
            absolute
            :color="inCart(product) ? 'red' : 'primary'"
            fab
            large
            right
            top
            class="white--text"
            @click="addToCart(product)"
          >
            <v-icon>mdi-cart</v-icon>
          </v-btn>
          <h3 class="text-h4 font-weight-light primary--text mb-2">
            {{ product.name }}
          </h3>
          <span>$ {{ (Math.random() * 100).toFixed(2) }}</span>
        </v-card-text>
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
  head() {
    return {
      title: this.category,
      meta: [
        {
          hid: 'og:image',
          property: 'og:image',
          content: 'https://picsum.photos/800/600',
        },
      ],
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
