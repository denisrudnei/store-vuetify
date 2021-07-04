<template>
  <v-row>
    <v-col v-if="selected.length" cols="12">
      <v-btn class="red white--text" @click="inactivateMany">
        Inactivate
      </v-btn>
    </v-col>
    <v-col cols="12">
      <v-data-table
        v-model="selected"
        :items="products"
        :headers="headers"
        show-select
      >
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
import { InactivateProducts } from '../../../graphql/mutation/product/InactivateProducts'
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
      selected: [],
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
    inactivateMany() {
      this.$apollo
        .mutate({
          mutation: InactivateProducts,
          variables: {
            ids: this.selected.map((item) => item.id),
          },
          awaitRefetchQueries: true,
          refetchQueries: [
            { query: GetProducts },
            { query: GetInactivatedProducts },
          ],
        })
        .then(() => {
          this.products = this.products.filter(
            (product) =>
              !this.selected.map((item) => item.id).includes(product.id)
          )
          this.$toast.show('Inactivated', {
            duration: 1000,
          })
          this.selected = []
        })
    },
  },
}
</script>

<style></style>
