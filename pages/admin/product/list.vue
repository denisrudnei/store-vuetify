<template>
  <v-row>
    <v-col cols="12">
      <v-row align="center">
        <v-col>
          <v-text-field
            v-model="search"
            label="Name"
            outlined
            :append-icon="icons.mdiMagnify"
            hide-details
          />
        </v-col>
        <v-col>
          <v-autocomplete
            v-model="selectedCategory"
            outlined
            label="Category"
            hide-details
            clearable
            :items="categories"
          />
        </v-col>
        <v-col cols="12" md="auto">
          <v-btn class="primary white--text">
            Search
            <v-icon right>{{ icons.mdiMagnify }}</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
    <v-col v-if="selected.length" cols="12">
      <v-row align="center">
        <v-col cols="12" md="4">
          <v-autocomplete
            v-model="category"
            :items="categories"
            outlined
            label="Update category"
            hide-details
            :append-outer-icon="icons.mdiTagOutline"
            clearable
            @click:append-outer="updateCategoryForProducts"
          />
        </v-col>
        <v-spacer />
        <v-col cols="12" md="auto">
          <v-btn class="red white--text" @click="inactivateMany">
            Inactivate
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12">
      <v-data-table
        v-model="selected"
        :items="searchedProducts"
        :headers="headers"
        show-select
      >
        <template #item.price="{ item }">
          {{ item.price | dinero }}
        </template>
        <template #item.category="{ item }">
          {{ item.category.name }}
        </template>
        <template #item.actions="{ item }">
          <v-tooltip left>
            <template #activator="{ on }">
              <v-btn
                class="primary--text"
                icon
                :to="`/admin/product/edit/${item.id}`"
                v-on="on"
              >
                <v-icon>{{ icons.mdiPencil }}</v-icon>
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
                <v-icon>{{ icons.mdiTagOff }}</v-icon>
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
import { mdiMagnify, mdiTagOutline, mdiPencil, mdiTagOff } from '@mdi/js'
import { InactivateProduct } from '../../../graphql/mutation/product/InactivateProduct'
import { InactivateProducts } from '../../../graphql/mutation/product/InactivateProducts'
import { GetProductInfo } from '../../../graphql/query/GetProductListInfo'
import { UpdateCategoryForProducts } from '../../../graphql/mutation/product/UpdateCategoryForProducts'
import { GetProducts } from '~/graphql/query/product/GetProducts'
import { GetInactivatedProducts } from '~/graphql/query/product/GetInactivatedProducts'
export default {
  data() {
    return {
      icons: {
        mdiMagnify,
        mdiTagOutline,
        mdiPencil,
        mdiTagOff,
      },
      search: '',
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
          text: 'Amount',
          value: 'amount',
        },
        {
          text: 'Category',
          value: 'category',
        },
        {
          text: 'Actions',
          value: 'actions',
        },
      ],
      selected: [],
      category: undefined,
      selectedCategory: undefined,
      categories: [],
    }
  },
  computed: {
    products: {
      get() {
        return this.$store.getters['products/getProducts']
      },
      set(value) {
        this.$store.commit('products/setProducts', value)
      },
    },
    searchedProducts() {
      return this.products
        .filter((product) =>
          product.name.toLowerCase().includes(this.search.toLowerCase())
        )
        .filter((product) => {
          if (!this.selectedCategory) return true
          return product.category.id === this.selectedCategory.id
        })
    },
  },
  created() {
    this.$apollo
      .query({
        query: GetProductInfo,
      })
      .then((response) => {
        this.products = response.data.GetProducts
        this.categories = response.data.GetAllCategories.map((category) => ({
          text: category.name,
          value: category,
        }))
      })
  },
  methods: {
    inactivate(id) {
      this.$dialog('Inactivate product?')
        .then(() => {
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
              this.products = this.products.filter(
                (product) => product.id !== id
              )
              this.$toast.show('Inactivated', {
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
    inactivateMany() {
      this.$dialog('Inactivate?')
        .then(() => {
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
        })
        .catch(() => {
          this.$toast.show('Canceled', {
            duration: 1000,
          })
        })
    },
    updateCategoryForProducts() {
      if (!this.category) return

      this.$dialog(
        `Set category "${
          this.categories.find(
            (category) => category.value.id === this.category.id
          ).text
        }" for ${this.selected.length} products?`
      )
        .then(() => {
          this.$apollo
            .mutate({
              mutation: UpdateCategoryForProducts,
              variables: {
                products: this.selected.map((product) => product.id),
                category: this.category.id,
              },
              awaitRefetchQueries: true,
              refetchQueries: [{ query: GetProducts }],
            })
            .then((response) => {
              response.data.UpdateCategoryForProducts.forEach((id) => {
                const product = this.products.find(
                  (product) => product.id === id
                )
                this.$store.commit('products/updateProduct', {
                  ...product,
                  category: this.categories.find(
                    (category) => category.value.id === this.category.id
                  ).value,
                })
              })
              this.$toast.show('Updated', {
                duration: 1000,
              })
            })
            .catch(() => {
              this.$toast.error('Failed to update', {
                duration: 10000,
              })
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
