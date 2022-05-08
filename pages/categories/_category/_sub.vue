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
            <v-card-text class="title"> Items: {{ total }} </v-card-text>
          </v-card>
        </v-col>
        <v-col v-if="!products.length" align="center">
          <v-row no-gutters>
            <v-col cols="12">
              <v-card tile elevation="0">
                <v-card-text>
                  <v-icon size="125" color="red">
                    {{ icons.mdiTagRemoveOutline }}
                  </v-icon>
                </v-card-text>
                <v-card-text class="title">
                  No products found for this category
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-divider />
              <other-products />
            </v-col>
          </v-row>
        </v-col>
        <v-col v-for="product in products" :key="product.id" cols="12" md="4">
          <product-card
            :product="{ ...product, category: category }"
            :hide-category="true"
          />
        </v-col>
        <v-col cols="12">
          <v-pagination v-model="page" :length="pages" :total-visible="5" />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import slugify from 'slugify'
import { mdiTagRemoveOutline } from '@mdi/js'
import productCard from '@/components/product/product-card'
import { GetCategoryByName } from '~/graphql/query/category/GetCategoryByName'
import theme from '~/mixins/theme'
import OtherProducts from '~/components/other-products.vue'
export default {
  auth: false,
  components: {
    productCard,
    OtherProducts,
  },
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
            ...response.data.GetCategoryByName.subCategories.edges.map(
              (edge) => edge.node
            ),
          ],
          products:
            response.data.GetCategoryByName.productsConnection.edges.map(
              (edge) => edge.node
            ),
          pages:
            response.data.GetCategoryByName.productsConnection.pageInfo.pages,
          total: response.data.GetCategoryByName.productsConnection.total,
        }
      })
      .catch(() => {
        error({ statusCode: 404, message: 'Category not found' })
      })
  },
  data() {
    return {
      total: 0,
      page: 1,
      pages: 0,
      icons: {
        mdiTagRemoveOutline,
      },
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
          hid: 'description',
          property: 'description',
          content: this.category.description,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.category.image,
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
    breadcrumbs() {
      if (!this.category) return []
      return this.category.fullName.split('|slash|').map((item) => {
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
  watch: {
    page() {
      this.search()
    },
  },
  created() {
    const { page } = this.$route.query

    if (page !== undefined) {
      this.page = parseInt(page)
    }
  },
  methods: {
    search() {
      this.$apollo
        .query({
          query: GetCategoryByName,
          variables: {
            name: this.$route.params.category,
            page: this.page,
          },
        })
        .then((response) => {
          this.category = response.data.GetCategoryByName
          this.subCategories = [
            response.data.GetCategoryByName,
            ...response.data.GetCategoryByName.subCategories.edges.map(
              (edge) => edge.node
            ),
          ]
          this.products =
            response.data.GetCategoryByName.productsConnection.edges.map(
              (edge) => edge.node
            )

          this.pages =
            response.data.GetCategoryByName.productsConnection.pageInfo.pages
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
}
</script>

<style></style>
