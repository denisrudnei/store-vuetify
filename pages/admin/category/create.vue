<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="category.name" label="Name" outlined />
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="category.description"
            label="Description"
            outlined
          />
        </v-col>
        <v-col cols="12">
          <v-autocomplete
            v-model="category.father"
            :items="categories"
            outlined
            label="Father"
          />
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn class="primary white--text" @click="save">
        Save
        <v-icon right>mdi-check-all</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { CreateCategory } from '../../../graphql/mutation/category/CreateCategory'
import { GetAllCategories } from '~/graphql/query/category/GetAllCategories'
export default {
  data() {
    return {
      categories: [],
      category: {
        name: '',
        description: '',
        father: undefined,
      },
    }
  },
  created() {
    this.$apollo
      .query({
        query: GetAllCategories,
      })
      .then((response) => {
        this.categories = response.data.GetAllCategories.map((item) => ({
          text: item.name,
          value: item.id,
        }))
      })
  },
  methods: {
    save() {
      this.$apollo
        .mutate({
          mutation: CreateCategory,
          variables: {
            category: this.category,
          },
          awaitRefetchQueries: true,
          refetchQueries: [{ query: GetAllCategories }],
        })
        .then(() => {
          this.$toast.show('Created', {
            duration: 1000,
          })
        })
    },
  },
}
</script>

<style></style>
