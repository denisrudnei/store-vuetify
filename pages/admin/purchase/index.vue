<template>
  <v-row>
    <v-col>
      <v-data-table :items="purchases" :headers="headers">
        <template #item.actions="{ item }">
          <v-btn
            icon
            class="primary white--text"
            :to="`/admin/purchase/${item.id}`"
          >
            <v-icon>{{ icons.mdiEye }}</v-icon>
          </v-btn>
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
import { GetPurchases } from '@/graphql/query/purchase/GetPurchases'
import { mdiEye } from '@mdi/js'
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
      purchases: [],
    }
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
