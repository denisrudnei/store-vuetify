<template>
  <v-row>
    <v-col>
      <v-data-table :items="products" :headers="headers">
        <template #item.actions>
          <v-btn icon class="primary white--text"
            ><v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { GetProducts } from '~/graphql/query/product/GetProducts'
export default {
  data() {
    return {
      headers: [
        {
          text: 'Name',
          value: 'name',
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
      products: [],
    }
  },
  created() {
    this.$apollo
      .query({
        query: GetProducts,
      })
      .then((response) => {
        this.products = response.data.GetProducts
      })
  },
}
</script>

<style></style>
