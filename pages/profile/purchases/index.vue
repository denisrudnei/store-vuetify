<template>
  <v-row>
    <v-col v-for="purchase in purchases" :key="purchase" cols="12">
      <purchase-card />
    </v-col>
  </v-row>
</template>

<script>
import purchaseCard from '~/components/purchase-card.vue'
export default {
  components: { purchaseCard },
  data() {
    return {
      purchases: Array.from({ length: 10 }, (_, i) => (i += 1)),
    }
  },
}
</script>

<style></style>
