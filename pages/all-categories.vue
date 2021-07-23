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
        <v-img :src="'/images/not-set.svg'" :aspect-ratio="16 / 9">
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
    store.commit('category/setAllCategories', data.GetAllCategories)
    return {
      allCategories: data.GetAllCategories,
    }
  },
  head: {
    title: 'Categories',
  },
}
</script>
