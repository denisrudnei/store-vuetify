<template>
  <v-card>
    <nuxt-link
      :to="`/categories/${product.category.slug}/product/${product.id}`"
    >
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
    <v-card-text v-if="!hideCart" style="position: relative">
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
      <span>$ {{ product.price }}</span>
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
</template>

<script>
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
