<template>
  <v-row>
    <v-col>
      <v-data-table :headers="headers" :items="categories">
        <template #item.actions="{ item }">
          <v-tooltip left>
            <template #activator="{ on }">
              <v-btn
                class="primary--text"
                icon
                :to="`/admin/category/edit/${item.slug}`"
                v-on="on"
              >
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
import { GetAllCategories } from '~/graphql/query/category/GetAllCategories'
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
        query: GetAllCategories,
      })
      .then((response) => {
        this.categories = response.data.GetAllCategories
      })
  },
}
</script>

<style></style>
