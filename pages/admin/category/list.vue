<template>
  <v-row>
    <v-col>
      <v-data-table :headers="headers" :items="categories"></v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { GetCategories } from '~/graphql/query/category/GetCategories'
export default {
  data() {
    return {
      headers: [
        {
          text: 'Name',
          value: 'name',
        },
      ],
      categories: [],
    }
  },
  created() {
    this.$apollo
      .query({
        query: GetCategories,
      })
      .then((response) => {
        this.categories = response.data.GetCategories
      })
  },
}
</script>

<style></style>
