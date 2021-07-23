<template>
  <v-row>
    <v-col v-if="selected.length" cols="12">
      <v-btn class="primary white--text" @click="reactivateMany">
        Activate
      </v-btn>
      <v-btn class="red white--text" @click="deleteMany">Delete</v-btn>
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
                <v-icon>{{ icons.mdiRestart }}</v-icon>
              </v-btn>
            </template>
            <span>Activate</span>
          </v-tooltip>
          <v-tooltip right>
            <template #activator="{ on }">
              <v-btn icon class="red--text" v-on="on" @click="remove(item.id)">
                <v-icon>{{ icons.mdiTagOff }}</v-icon>
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
import { mdiRestart, mdiTagOff } from '@mdi/js'
import { GetInactivatedProducts } from '../../../graphql/query/product/GetInactivatedProducts'
import { ReactivateProduct } from '../../../graphql/mutation/product/ReactivateProduct'
import { ReactivateProducts } from '../../../graphql/mutation/product/ReactivateProducts'
import { DeleteProduct } from '../../../graphql/mutation/product/DeleteProduct'
import { DeleteProducts } from '../../../graphql/mutation/product/DeleteProducts'
import { GetProducts } from '~/graphql/query/product/GetProducts'
export default {
  data() {
    return {
      icons: {
        mdiRestart,
        mdiTagOff,
      },
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
      this.$dialog('Reactivate?')
        .then(() => {
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
        })
        .catch(() => {
          this.$toast.show('Canceled', {
            duration: 1000,
          })
        })
    },
    reactivateMany() {
      this.$dialog('Reactivate?')
        .then(() => {
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
              this.selected = []
            })
        })
        .catch(() => {
          this.$toast.show('Canceled', {
            duration: 1000,
          })
        })
    },
    remove(id) {
      this.$dialog('Remove?')
        .then(() => {
          this.$apollo
            .mutate({
              mutation: DeleteProduct,
              variables: {
                id,
              },
              awaitRefetchQueries: true,
              refetchQueries: [
                { query: GetInactivatedProducts },
                { query: GetProducts },
              ],
            })
            .then((response) => {
              if (response.data.DeleteProduct) {
                this.$toast.show('Deleted', {
                  duration: 5000,
                })
                this.inactivated = this.inactivated.filter(
                  (item) => item.id !== id
                )
              } else {
                this.$toast.show('It was not possible to delete', {
                  duration: 5000,
                })
              }
            })
        })
        .catch(() => {
          this.$toast.show('Canceled', {
            duration: 1000,
          })
        })
    },
    deleteMany() {
      this.$dialog('Remove?')
        .then(() => {
          this.$apollo
            .mutate({
              mutation: DeleteProducts,
              variables: {
                ids: this.selected.map((item) => item.id),
              },
              awaitRefetchQueries: true,
              refetchQueries: [{ query: GetInactivatedProducts }],
            })
            .then((response) => {
              const products = response.data.DeleteProducts
              const deleted = products.filter((product) => product.deleted)
              deleted.forEach((product) => {
                this.inactivated = this.inactivated.filter(
                  (item) => item.id !== product.id
                )
              })
              if (products.length !== deleted.length) {
                this.$toast('It was not possible to delete some products', {
                  duration: 5000,
                })
              } else {
                this.$toast.show('Deleted', {
                  duration: 1000,
                })
              }
            })
        })
        .catch(() => {
          this.$toast.show('Canceled', {
            duration: 1000,
          })
        })
    },
  },
}
</script>

<style></style>
