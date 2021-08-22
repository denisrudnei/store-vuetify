<template>
  <v-row>
    <v-col cols="12" md="4">
      <delivery-card :value="required" title="Required" />
    </v-col>
    <v-col cols="12" md="4">
      <delivery-card :value="inProduction" title="In production" />
    </v-col>
    <v-col cols="12" md="4">
      <delivery-card :value="deliveryProcess" title="Delivery process" />
    </v-col>
  </v-row>
</template>

<script>
import { GetDelivery } from '../../../graphql/query/purchase/GetDelivery'
import deliveryCard from '@/components/delivery-card'
import { NewPurchase } from '~/graphql/subscription/purchase/NewPurchase'
export default {
  components: {
    deliveryCard,
  },
  data() {
    return {
      deliveries: [],
    }
  },
  computed: {
    required() {
      return this.deliveries.filter(
        (delivery) => delivery.status === 'REQUIRED'
      )
    },
    inProduction() {
      return this.deliveries.filter(
        (delivery) => delivery.status === 'IN_PRODUCTION'
      )
    },
    deliveryProcess() {
      return this.deliveries.filter(
        (delivery) => delivery.status === 'DELIVERY_PROCESS'
      )
    },
  },
  mounted() {
    const vue = this
    const newPurchaseSubscription = this.$apollo.subscribe({
      query: NewPurchase,
    })
    newPurchaseSubscription.subscribe({
      next({ data }) {
        if (data.NewPurchase.type === 'DELIVERY') {
          vue.deliveries.push(data.NewPurchase)
        }
      },
    })
  },
  created() {
    this.$apollo
      .query({
        query: GetDelivery,
      })
      .then((response) => {
        this.deliveries = response.data.GetDelivery
      })
  },
}
</script>

<style></style>
