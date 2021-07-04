<template>
  <v-row>
    <v-col>
      <v-data-table :headers="headers" :items="categories">
        <template #item.actions>
          <v-tooltip left>
            <template #activator="{ on }">
              <v-btn class="primary--text" icon v-on="on">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <span>Edit</span>
          </v-tooltip>
          <v-tooltip right>
            <template #activator="{ on }">
              <v-btn class="primary--text" icon v-on="on">
                <v-icon>mdi-tag-off</v-icon>
              </v-btn>
            </template>
            <span>Inactivate</span>
          </v-tooltip>
        </template>
      </v-data-table>
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
        {
          text: 'Actions',
          value: 'actions',
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
