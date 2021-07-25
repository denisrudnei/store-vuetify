<template>
  <v-row>
    <v-col cols="12" md="10">
      <v-data-table :items="cart" :headers="headers">
        <template #item.image>
          <v-img
            :src="`https://picsum.photos/800/600/?${Math.random()}`"
            :aspect-ratio="21 / 9"
            :width="250"
            class="pa-2 ma-1"
          />
        </template>
        <template #item.actions="{ item }">
          <v-btn icon class="red--text" @click="remove(item.id)">
            <v-icon>{{ icons.mdiDelete }}</v-icon>
          </v-btn>
        </template>
        <template #item.unitary="{ item }">
          <span>{{ item.unitary | price }}</span>
        </template>
        <template #item.price="{ item }">
          <span>{{ item.price | price }}</span>
        </template>
      </v-data-table>
    </v-col>
    <v-col cols="12" md="2">
      <cart-info />
    </v-col>
    <v-col cols="12">
      <v-btn class="primary white--text" :disabled="!cart.length" to="/buy">
        Buy
        <v-icon right> {{ icons.mdiCashMultiple }}</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import cartInfo from '@/components/cartInfo.vue'
import { mdiDelete, mdiCashMultiple } from '@mdi/js'
export default {
  auth: false,
  components: {
    cartInfo,
  },
  filters: {
    price(value) {
      return `$ ${value}`
    },
  },
  data() {
    return {
      icons: {
        mdiDelete,
        mdiCashMultiple,
      },
      headers: [
        {
          text: 'Image',
          value: 'image',
          sortable: false,
        },
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'Unitary',
          value: 'unitary',
        },
        {
          text: 'Amount',
          value: 'amount',
        },
        {
          text: 'Price',
          value: 'price',
        },
        {
          text: 'Actions',
          value: 'actions',
        },
      ],
    }
  },
  head: {
    title: 'Cart',
  },
  computed: {
    cart: {
      get() {
        return this.$store.getters['products/getCart']
      },
    },
  },
  methods: {
    remove(id) {
      this.$store.commit('products/remove', id)
    },
  },
}
</script>

<style></style>
