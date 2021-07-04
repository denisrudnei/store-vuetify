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
      md="6"
    >
      <v-card :to="`/categories/${category.slug}`">
        <v-img
          :src="`https://picsum.photos/800/600/?${category.name}`"
          :aspect-ratio="16 / 9"
        >
          <template #placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="primary lighten-5" />
            </v-row>
          </template>
        </v-img>
        <v-card-title>
          {{ category.name }}
        </v-card-title>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { GetCategories } from '../graphql/query/category/GetCategories'
export default {
  async asyncData({ store, app }) {
    const { data } = await app.apolloProvider.defaultClient.query({
      query: GetCategories,
    })
    store.commit('category/setCategories', data.GetCategories)
    return {
      categories: data.GetCategories,
    }
  },
  head: {
    title: 'Home',
  },
}
</script>
