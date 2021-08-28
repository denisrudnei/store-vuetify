<template>
  <v-row justify="center" align="center">
    <v-col cols="12" class="text-center">
      <h2 class="text-h2">Categories</h2>
    </v-col>
    <v-col
      v-for="category in categories"
      :key="category.id"
      cols="12"
      sm="8"
      md="4"
    >
      <v-card :to="`/categories/${category.slug}`">
        <v-img :src="category.image" :aspect-ratio="16 / 9">
          <template #placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="primary lighten-5" />
            </v-row>
          </template>
        </v-img>
        <v-card-text>
          <v-tooltip top>
            <template #activator="{ on }">
              <p class="text-center text-truncate title" v-on="on">
                {{ category.name }}
              </p>
            </template>
            <span>{{ category.name }}</span>
          </v-tooltip>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { GetIndexPage } from '../graphql/query/GetIndexPage'
export default {
  auth: false,
  async asyncData({ store, app }) {
    const { data } = await app.apolloProvider.defaultClient.query({
      query: GetIndexPage,
    })
    store.commit('category/setCategories', data.GetCategories)
    return {
      categories: data.GetCategories,
      title: data.GetSiteSettings.name,
      description: data.GetSiteSettings.name,
      image: data.GetSiteSettings.logo,
    }
  },
  head() {
    return {
      title: this.title,
      meta: [
        {
          hid: 'description',
          property: 'description',
          content: this.title,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.image,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.title,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.title,
        },
      ],
    }
  },
}
</script>
