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
            :to="`/admin/purchase/view/${item.id}`"
          >
            <v-icon>{{ icons.mdiEye }}</v-icon>
          </v-btn>
        </template>
        <template #item.totalPrice="{ item }">
          {{ item.totalPrice | dinero }}
        </template>
        <template #item.type="{ item }">
          <v-chip text label>
            <v-icon left>
              {{ getIcon(item.type) }}
            </v-icon>
            {{ item.type }}
          </v-chip>
        </template>
        <template #item.payment="{ item }">
          <span v-show="item.payment.change" class="red--text">
            {{ item.payment.change | dinero }}
          </span>
          <span v-show="!item.payment.change"> It is not necessary </span>
        </template>
        <template #item.createdAt="{ item }">
          {{ item.createdAt | dateAndHour }}
        </template>
        <template #item.user="{ item }">
          <template v-if="item.user">
            <v-avatar class="mt-1 mr-3">
              <v-img :src="item.user.image" />
            </v-avatar>
            {{ item.user.name }}
          </template>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { mdiEye, mdiCashMultiple, mdiTruck, mdiRoomService } from '@mdi/js'
export default {
  data() {
    return {
      icons: {
        mdiEye,
        mdiCashMultiple,
        mdiTruck,
        mdiRoomService,
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
          text: 'Origin',
          value: 'origin',
        },
        {
          text: 'Type',
          value: 'type',
        },
        {
          text: 'Status',
          value: 'status',
        },
        {
          text: 'Change',
          value: 'payment',
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
  methods: {
    getIcon(type) {
      switch (type) {
        case 'NORMAL':
          return this.icons.mdiCashMultiple
        case 'RESTAURANT_ORDER':
          return this.icons.mdiRoomService
        case 'DELIVERY':
          return this.icons.mdiTruck
        default:
          return this.icons.mdiCashMultiple
      }
    },
  },
}
</script>

<style></style>
