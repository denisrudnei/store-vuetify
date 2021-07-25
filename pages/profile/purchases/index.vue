<template>
  <v-row>
    <v-col v-for="purchase in purchases" :key="purchase" cols="12">
      <purchase-card :purchase="purchase" />
    </v-col>
  </v-row>
</template>

<script>
import { GetMyPurchases } from '../../../graphql/query/purchase/GetMyPurchases'
import purchaseCard from '~/components/purchase-card.vue'
export default {
  components: { purchaseCard },
  data() {
    return {
      purchases: [],
    }
  },
  head: {
    title: 'Purchases',
  },
  created() {
    this.$apollo
      .query({
        query: GetMyPurchases,
      })
      .then((response) => {
        this.purchases = response.data.GetMyPurchases
      })
  },
}
</script>

<style></style>
