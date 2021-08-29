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
export default {
  components: {
    deliveryCard,
  },
  computed: {
    deliveries: {
      get() {
        return this.$store.getters['purchase/getDeliveries']
      },
      set(value) {
        this.$store.commit('purchase/setDeliveries', value)
      },
    },
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
  created() {
    this.$apollo
      .query({
        query: GetDelivery,
        fetchPolicy: 'network-only',
      })
      .then((response) => {
        this.deliveries = response.data.GetDelivery
      })
  },
}
</script>

<style></style>
