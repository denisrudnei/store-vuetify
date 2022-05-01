<template>
  <v-row justify="center" align="center">
    <v-col
      v-for="category in allCategories"
      :key="category.id"
      cols="12"
      sm="8"
      md="3"
    >
      <v-card :to="`/categories/${category.slug}`">
        <v-img :src="category.image" :aspect-ratio="16 / 9">
          <template #placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="primary lighten-5" />
            </v-row>
          </template>
        </v-img>
        <v-card-title>
          <v-tooltip top>
            <template #activator="{ on }">
              <span class="text-truncate" v-on="on">{{ category.name }}</span>
            </template>
            <span>{{ category.name }}</span>
          </v-tooltip>
        </v-card-title>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-pagination v-model="page" :total-visible="5" :length="pages" />
    </v-col>
  </v-row>
</template>

<script>
import { GetAllCategories } from '../graphql/query/category/GetAllCategories'
export default {
  auth: false,
  async asyncData({ store, app }) {
    const { data } = await app.apolloProvider.defaultClient.query({
      query: GetAllCategories,
    })
    store.commit(
      'category/setAllCategories',
      data.GetAllCategories.edges.map((edge) => edge.node)
    )
    return {
      allCategories: data.GetAllCategories.edges.map((edge) => edge.node),
      pages: data.GetAllCategories.pageInfo.pages,
      page: data.GetAllCategories.pageInfo.page,
    }
  },
  data() {
    return {
      page: 1,
    }
  },
  head: {
    title: 'Categories',
  },
  watch: {
    page() {
      console.log(`Page ${this.page}`)
      this.$router.push({
        query: {
          page: this.page,
        },
      })
      this.search()
    },
  },
  mounted() {
    if (this.$route.query.page !== undefined) {
      this.page = parseInt(this.$route.query.page)
    }
  },
  methods: {
    search() {
      this.$apollo
        .query({
          query: GetAllCategories,
          variables: {
            page: this.page,
          },
        })
        .then((response) => {
          this.allCategories = response.data.GetAllCategories.edges.map(
            (edge) => edge.node
          )
          this.page = response.data.GetAllCategories.pageInfo.page
          this.pages = response.data.GetAllCategories.pageInfo.pages
        })
    },
  },
}
</script>
