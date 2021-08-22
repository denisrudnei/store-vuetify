<template>
  <list-purchases />
</template>

<script>
import { GetNormalPurchases } from '../../../graphql/query/purchase/GetNormalPurchases'
import { NewPurchase } from '~/graphql/subscription/purchase/NewPurchase'
export default {
  computed: {
    purchases: {
      get() {
        return this.$store.getters['purchase/getPurchases']
      },
      set(value) {
        this.$store.commit('purchase/setPurchases', value)
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
        if (data.NewPurchase.type === 'NORMAL') {
          vue.$store.commit('purchase/addPurchase', data.NewPurchase)
        }
      },
    })
  },
  created() {
    this.$apollo
      .query({
        query: GetNormalPurchases,
      })
      .then((response) => {
        this.purchases = response.data.GetNormalPurchases
      })
  },
}
</script>

<style></style>
