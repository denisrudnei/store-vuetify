<template>
  <v-row>
    <v-col cols="12">
      <v-text-field
        v-model="search.name"
        outlined
        label="Search"
        clearable
        :prepend-inner-icon="icons.mdiMagnify"
        @keypress.enter="getData"
      />
    </v-col>
    <v-col v-if="category">
      <v-card>
        <v-card-text> Category: {{ category.name }} </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-row>
        <v-col cols="12" md="8" :order="isMobile ? 'last' : 'first'">
          <v-row>
            <v-col v-if="state === 'ERROR'" cols="12">
              <v-alert prominent outlined color="error">
                Failed to load
              </v-alert>
            </v-col>
            <v-col v-if="state === 'LOADING'" cols="12">
              <v-card>
                <v-card-title>Loading</v-card-title>
                <v-card-text>
                  <v-progress-linear indeterminate color="primary" />
                </v-card-text>
              </v-card>
            </v-col>
            <v-col v-if="state === 'LOADED' && !products.length" cols="12">
              <v-alert :icon="icons.mdiTagOff" outlined prominent color="error">
                No products found
              </v-alert>
            </v-col>
            <v-col
              v-for="product in products"
              :key="product.id"
              cols="12"
              md="6"
              lg="4"
            >
              <product-card :product="product" />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="4" :order="isMobile ? 'first' : 'last'">
          <v-card elevation="0">
            <v-card-text>
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="search['min-price']"
                    label="Min price"
                    outlined
                    type="tel"
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="search['max-price']"
                    label="Max price"
                    outlined
                    type="tel"
                  />
                </v-col>
                <v-col cols="12">
                  <v-btn
                    class="primary white--text"
                    block
                    @click="searchProducts"
                  >
                    Search
                  </v-btn>
                </v-col>
                <v-col cols="12">
                  <h5 class="text-h5">Categories</h5>
                  <v-chip label class="ma-2" @click="setCategory()">
                    <v-icon left>{{ icons.mdiTag }}</v-icon>
                    All
                  </v-chip>
                  <v-chip
                    v-for="item in categories"
                    :key="item.id"
                    label
                    class="ma-2"
                    @click="setCategory(item.id)"
                  >
                    <v-icon left>{{ icons.mdiTag }}</v-icon>
                    {{ item.name }}
                  </v-chip>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mdiMagnify, mdiTag, mdiTagOff } from '@mdi/js'
import ProductCard from '~/components/product/product-card.vue'
import { AllProductsPage } from '~/graphql/query/product/AllProductsPage'
import theme from '~/mixins/theme'
import { GetAllCategories } from '~/graphql/query/category/GetAllCategories'
export default {
  auth: false,
  components: {
    ProductCard,
  },
  mixins: [theme],
  data() {
    return {
      state: 'ERROR',
      icons: {
        mdiMagnify,
        mdiTag,
        mdiTagOff,
      },
      search: {
        name: '',
        category: undefined,
        'min-price': undefined,
        'max-price': undefined,
      },
      minPrice: undefined,
      maxPrice: undefined,
      products: [],
      categories: [],
    }
  },
  computed: {
    category() {
      return this.categories.find(
        (category) => category.id === this.search.category
      )
    },
  },
  watch: {
    search: {
      deep: true,
      handler() {
        this.$router.push({
          query: {
            ...this.search,
          },
        })
      },
    },
  },
  created() {
    const {
      name,
      category,
      'min-price': minPrice,
      'max-price': maxPrice,
    } = this.$router.currentRoute.query

    this.search = {
      name: name || '',
      category,
      'min-price': minPrice ? Number(minPrice) : undefined,
      'max-price': maxPrice ? Number(maxPrice) : undefined,
    }
    this.$apollo
      .query({
        query: GetAllCategories,
      })
      .then((response) => {
        this.categories = response.data.GetAllCategories
      })
    this.getData()
  },
  methods: {
    setCategory(id) {
      if (!id) {
        this.search.category = undefined
        this.getData()
        return
      }
      this.search.category = id
      if (!this.category) return

      this.$router.push({
        query: {
          category: this.category.slug,
        },
      })
      this.getData()
    },
    getData() {
      this.state = 'LOADING'
      this.products = []
      this.$apollo
        .query({
          query: AllProductsPage,
          variables: {
            search: {
              name: this.search.name,
              minPrice: this.search['min-price']
                ? Number(this.search['min-price'])
                : undefined,
              maxPrice: this.search['max-price']
                ? Number(this.search['max-price'])
                : undefined,
              category: this.search.category,
            },
          },
        })
        .then((response) => {
          this.products = response.data.SearchProducts
          this.state = 'LOADED'
        })
        .catch(() => {
          this.state = 'ERROR'
        })
    },
    searchProducts() {
      this.getData()
    },
  },
}
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
