<template>
  <v-card elevation="0">
    <v-card-text>
      Total: {{ total | price }}
      <v-divider />
      Items: {{ quantity }}
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  filters: {
    price(value) {
      return `$ ${value}`
    },
  },
  computed: {
    cart: {
      get() {
        return this.$store.getters['products/getCart']
      },
    },
    quantity() {
      return this.cart.reduce((previous, item) => previous + item.quantity, 0)
    },
    total() {
      return this.cart.reduce(
        (previous, item) => previous + parseInt(item.price, 10),
        0
      )
    },
  },
}
</script>

<style></style>
