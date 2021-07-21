<template>
  <v-row>
    <v-col cols="12">
      <v-text-field
        v-model="search"
        outlined
        label="Search"
        append-icon="mdi-magnify"
      />
    </v-col>
    <v-col cols="12">
      <v-row>
        <v-col cols="12" md="8">
          <v-row>
            <v-col
              v-for="product in products"
              :key="product.id"
              cols="12"
              md="4"
            >
              <product-card :product="product" />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="4">
          <v-card elevation="0">
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="category"
                    label="Category"
                    outlined
                    :items="categories"
                  />
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-btn class="primary white--text" block> Search </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import ProductCard from '~/components/product/product-card.vue'
import { AllProductsPage } from '~/graphql/query/product/AllProductsPage'
import theme from '~/mixins/theme'
export default {
  auth: false,
  components: {
    ProductCard,
  },
  mixins: [theme],
  data() {
    return {
      search: '',
      productsData: [],
      categories: [],
      category: undefined,
    }
  },
  computed: {
    products() {
      return this.productsData.filter((product) =>
        product.name.toLowerCase().includes(this.search.toLowerCase())
      )
    },
  },
  created() {
    this.$apollo
      .query({
        query: AllProductsPage,
      })
      .then((response) => {
        this.categories = response.data.GetAllCategories.map((category) => ({
          text: category.name,
          value: category,
        }))
        this.productsData = response.data.GetProducts
      })
  },
}
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
