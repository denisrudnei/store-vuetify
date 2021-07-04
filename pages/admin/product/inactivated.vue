<template>
  <v-row>
    <v-col v-if="selected.length" cols="12">
      <v-btn class="primary white--text" @click="reactivateMany">
        Activate
      </v-btn>
      <v-btn class="red white--text">Delete</v-btn>
    </v-col>
    <v-col cols="12">
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="inactivated"
        show-select
      >
        <template #item.actions="{ item }">
          <v-tooltip left>
            <template #activator="{ on }">
              <v-btn icon v-on="on" @click="reactivate(item.id)">
                <v-icon>mdi-restart</v-icon>
              </v-btn>
            </template>
            <span>Activate</span>
          </v-tooltip>
          <v-tooltip right>
            <template #activator="{ on }">
              <v-btn icon class="red--text" v-on="on">
                <v-icon>mdi-tag-off</v-icon>
              </v-btn>
            </template>
            <span>Delete</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { GetInactivatedProducts } from '../../../graphql/query/product/GetInactivatedProducts'
import { ReactivateProduct } from '../../../graphql/mutation/product/ReactivateProduct'
import { ReactivateProducts } from '../../../graphql/mutation/product/ReactivateProducts'
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
      inactivated: [],
      selected: [],
    }
  },
  created() {
    this.$apollo
      .query({
        query: GetInactivatedProducts,
      })
      .then((response) => {
        this.inactivated = response.data.GetInactivatedProducts
      })
  },
  methods: {
    reactivate(id) {
      this.$apollo
        .mutate({
          mutation: ReactivateProduct,
          variables: {
            id,
          },
          awaitRefetchQueries: true,
          refetchQueries: [
            { query: GetInactivatedProducts },
            { query: GetProducts },
          ],
        })
        .then(() => {
          this.inactivated = this.inactivated.filter(
            (product) => product.id !== id
          )
          this.$toast.show('Reactivated', {
            duration: 1000,
          })
        })
    },
    reactivateMany() {
      this.$apollo
        .mutate({
          mutation: ReactivateProducts,
          variables: {
            ids: this.selected.map((item) => item.id),
          },
          awaitRefetchQueries: true,
          refetchQueries: [
            { query: GetInactivatedProducts },
            { query: GetProducts },
          ],
        })
        .then(() => {
          this.inactivated = this.inactivated.filter(
            (product) =>
              !this.selected.map((item) => item.id).includes(product.id)
          )
          this.$toast.show('Reactivated', {
            duration: 1000,
          })
        })
    },
  },
}
</script>

<style></style>
