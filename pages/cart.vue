<template>
  <v-row>
    <v-col>
      <v-data-table :items="cart" :headers="headers">
        <template #item.actions="{ item }">
          <v-btn icon class="red--text" @click="remove(item.id)">
            <v-icon>mdi-delete</v-icon>
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
  </v-row>
</template>

<script>
export default {
  filters: {
    price(value) {
      return `R$ ${value}`
    },
  },
  data() {
    return {
      headers: [
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'Unitary',
          value: 'unitary',
        },
        {
          text: 'Quantity',
          value: 'quantity',
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
