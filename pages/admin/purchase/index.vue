<template>
  <v-row>
    <v-col>
      <v-data-table
        :items="purchases"
        :headers="headers"
        :sort-by="['createdAt']"
        :sort-desc="[true]"
      >
        <template #item.actions="{ item }">
          <v-btn
            icon
            class="primary white--text"
            :to="`/admin/purchase/${item.id}`"
          >
            <v-icon>{{ icons.mdiEye }}</v-icon>
          </v-btn>
        </template>
        <template #item.totalPrice="{ item }">
          {{ item.totalPrice | dinero }}
        </template>
        <template #item.createdAt="{ item }">
          {{ item.createdAt | dateAndHour }}
        </template>
        <template #item.user="{ item }">
          <v-avatar class="mt-1 mr-3">
            <v-img :src="item.user.image" />
          </v-avatar>
          {{ item.user.name }}
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { mdiEye } from '@mdi/js'
import { GetPurchases } from '@/graphql/query/purchase/GetPurchases'
import { NewPurchase } from '@/graphql/subscription/purchase/NewPurchase'
export default {
  data() {
    return {
      icons: {
        mdiEye,
      },
      headers: [
        {
          text: 'Actions',
          value: 'actions',
          sortable: false,
        },
        {
          text: 'Date',
          value: 'createdAt',
        },
        {
          text: 'Items',
          value: 'totalAmount',
        },
        {
          text: 'Total',
          value: 'totalPrice',
        },
        {
          text: 'User',
          value: 'user',
        },
      ],
    }
  },
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
