<template>
  <list-purchases />
</template>

<script>
import { GetPurchases } from '@/graphql/query/purchase/GetPurchases'
import { NewPurchase } from '@/graphql/subscription/purchase/NewPurchase'
import listPurchases from '~/components/list-purchases.vue'
export default {
  components: { listPurchases },
  computed: {
    purchases: {
      set(value) {
        this.$store.commit('purchase/setPurchases', value)
      },
      get() {
        return this.$store.getters['purchase/getPurchases']
      },
    },
  },
  mounted() {
    const vue = this
    const newPurchaseSubscription = this.$apollo.subscribe({
      query: NewPurchase,
    })
    newPurchaseSubscription.subscribe({
      next({ data }) {
        vue.$store.commit('purchase/addPurchase', data.NewPurchase)
      },
    })
  },
  created() {
    this.$apollo
      .query({
        query: GetPurchases,
      })
      .then((response) => {
        this.purchases = response.data.GetPurchases
      })
  },
}
</script>

<style></style>
