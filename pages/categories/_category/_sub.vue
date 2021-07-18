<template>
  <v-row>
    <v-col cols="12">
      <v-card elevation="0" tile>
        <v-card-text>
          <v-breadcrumbs :items="breadcrumbs">
            <template #item="{ item }">
              <v-breadcrumbs-item>
                <v-btn v-if="!isMobile" :to="item.href" tile text>
                  {{ item.text }}
                </v-btn>
                <router-link v-if="isMobile" :to="item.href">
                  {{ item.text }}
                </router-link>
              </v-breadcrumbs-item>
            </template>
          </v-breadcrumbs>
          <v-tabs v-if="subCategories.length" class="mt-2" show-arrows>
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
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-row justify="center" align="center">
        <v-col v-if="products.length" cols="12">
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
        <v-col v-if="!products.length" align="center">
          <v-card tile elevation="0">
            <v-card-text>
              <v-icon size="125" color="red"> mdi-tag-remove-outline </v-icon>
            </v-card-text>
            <v-card-text class="title">No products found</v-card-text>
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
import slugify from 'slugify'
import { GetCategoryByName } from '~/graphql/query/category/GetCategoryByName'
import theme from '~/mixins/theme'
export default {
  auth: false,
  mixins: [theme],
  asyncData({ app, error, route }) {
    return app.apolloProvider.defaultClient
      .query({
        query: GetCategoryByName,
        variables: {
          name: route.params.category,
        },
      })
      .then((response) => {
        return {
          category: response.data.GetCategoryByName,
          subCategories: [
            response.data.GetCategoryByName,
            ...response.data.GetCategoryByName.subCategories,
          ],
          products: response.data.GetCategoryByName.products,
        }
      })
      .catch(() => {
        error({ statusCode: 404, message: 'Category not found' })
      })
  },
  data() {
    return {
      length: 0,
      subCategories: [],
      category: {
        name: '',
        description: '',
        fullName: '',
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
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.category.name,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.category.description,
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
    breadcrumbs() {
      if (!this.category) return []
      return this.category.fullName.split('/').map((item) => {
        const link = slugify(item, {
          replacement: '-',
          lower: true,
        })
        return {
          text: item,
          href: `/categories/${link}`,
        }
      })
    },
  },
  jsonld() {
    const items = this.breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@id': item.href,
        name: item.text,
      },
    }))
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items,
    }
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
