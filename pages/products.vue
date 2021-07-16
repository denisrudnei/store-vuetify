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
              <v-card>
                <router-link :to="`/product/${product.id}`">
                  <v-img
                    :src="`https://picsum.photos/800/600/?${Math.random()}`"
                    :aspect-ratio="16 / 9"
                  />
                </router-link>
                <v-card-title>
                  <router-link
                    :to="`/product/${product.id}`"
                    class="white--text"
                  >
                    {{ product.name }}
                  </router-link>
                </v-card-title>
                <v-card-text>
                  <span>$ {{ product.price }}</span>
                  <v-divider class="pt-2 pb-4" />
                  <v-chip
                    :to="`/categories/${product.category.slug}`"
                    label
                    class="primary white--text"
                  >
                    {{ product.category.name }}
                  </v-chip>
                </v-card-text>
              </v-card>
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
import { AllProductsPage } from '~/graphql/query/product/AllProductsPage'
export default {
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
