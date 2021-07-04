<template>
  <v-row>
    <v-col>
      <v-data-table :items="products" :headers="headers">
        <template #item.actions>
          <v-tooltip left>
            <template #activator="{ on }">
              <v-btn class="primary--text" icon v-on="on">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <span>Edit</span>
          </v-tooltip>
          <v-tooltip right>
            <template #activator="{ on }">
              <v-btn class="primary--text" icon v-on="on">
                <v-icon>mdi-tag-off</v-icon>
              </v-btn>
            </template>
            <span>Inactivate</span>
          </v-tooltip>
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
