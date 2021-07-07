<template>
  <v-row>
    <v-col cols="12">
      <v-tabs v-if="subCategories.length">
        <v-tab
          v-for="subCategory in subCategories"
          :key="subCategory.id"
          :to="`/categories/${subCategory.slug}`"
        >
          {{ subCategory.name }}
        </v-tab>
      </v-tabs>
      <v-tabs v-if="!subCategories.length && category.father">
        <v-tab
          v-for="subCategory in category.father.subCategories"
          :key="subCategory.id"
          :to="`/categories/${subCategory.slug}`"
        >
          {{ subCategory.name }}
        </v-tab>
      </v-tabs>
    </v-col>
    <v-col cols="12">
      <v-row justify="center" align="center">
        <v-col cols="12">
          <v-card
            :dark="!$vuetify.theme.dark"
            :color="!$vuetify.theme.dark ? 'primary' : undefined"
            flat
          >
            <v-card-text class="title">
              Items: {{ products.length }}
            </v-card-text>
          </v-card>
        </v-col>
        <v-col v-for="product in products" :key="product.id" cols="12" md="4">
          <v-card>
            <nuxt-link
              :to="`/categories/${category.slug}/product/${product.id}`"
            >
              <v-img
                :src="`https://picsum.photos/800/600/?${Math.random()}`"
                :aspect-ratio="16 / 9"
              >
                <template #placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="grey lighten-5"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </nuxt-link>
            <v-card-text style="position: relative">
              <v-btn
                absolute
                :color="inCart(product) ? 'red' : 'primary'"
                fab
                large
                right
                top
                class="white--text"
                @click="addToCart(product)"
              >
                <v-icon>mdi-cart</v-icon>
              </v-btn>
              <h3 class="text-h4 font-weight-light primary--text mb-2">
                {{ product.name }}
              </h3>
              <span>$ {{ product.price }}</span>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { GetCategoryByName } from '~/graphql/query/category/GetCategoryByName'
export default {
  data() {
    return {
      length: 0,
      subCategories: [],
      category: {
        name: '',
        description: '',
      },
      products: [],
    }
  },
  head() {
    return {
      title: this.category.name,
      meta: [
        {
          hid: 'og:image',
          property: 'og:image',
          content: 'https://picsum.photos/800/600',
        },
      ],
    }
  },
  computed: {
    cart: {
      get() {
        return this.$store.getters['products/getCart']
      },
    },
  },
  created() {
    this.$apollo
      .query({
        query: GetCategoryByName,
        variables: {
          name: this.$route.params.category,
        },
      })
      .then((response) => {
        this.category = response.data.GetCategoryByName
        this.subCategories = [
          this.category,
          ...response.data.GetCategoryByName.subCategories,
        ]
        this.products = response.data.GetCategoryByName.products
      })
  },
  methods: {
    addToCart(product) {
      this.$store.commit('products/addToCart', product)
    },
    inCart(item) {
      return this.cart.map((item) => item.id).includes(item.id)
    },
  },
}
</script>

<style></style>
