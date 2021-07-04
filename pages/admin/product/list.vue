<template>
  <v-row>
    <v-col>
      <v-data-table :items="products" :headers="headers">
        <template #item.actions="{ item }">
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
              <v-btn
                class="primary--text"
                icon
                v-on="on"
                @click="inactivate(item.id)"
              >
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
import { InactivateProduct } from '../../../graphql/mutation/product/InactivateProduct'
import { GetProducts } from '~/graphql/query/product/GetProducts'
import { GetInactivatedProducts } from '~/graphql/query/product/GetInactivatedProducts'
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
  methods: {
    inactivate(id) {
      this.$apollo
        .mutate({
          mutation: InactivateProduct,
          variables: {
            id,
          },
          awaitRefetchQueries: true,
          refetchQueries: [
            { query: GetProducts },
            { query: GetInactivatedProducts },
          ],
        })
        .then(() => {
          this.products = this.products.filter((product) => product.id !== id)
          this.$toast.show('Inactivated', {
            duration: 1000,
          })
        })
    },
  },
}
</script>

<style></style>
