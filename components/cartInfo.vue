<template>
  <v-card elevation="0">
    <v-card-text>
      Total: {{ total | dinero }}
      <v-divider />
      Items: {{ amount }}
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  computed: {
    cart: {
      get() {
        return this.$store.getters['products/getCart']
      },
    },
    amount() {
      return this.cart.reduce((previous, item) => previous + item.amount, 0)
    },
    total() {
      return this.cart.reduce(
        (previous, item) => previous + parseFloat(item.price),
        0
      )
    },
  },
}
</script>

<style></style>
