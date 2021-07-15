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
            clearable
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
import { GetAllCategories } from '~/graphql/query/category/GetAllCategories'
export default {
  props: {
    value: {
      type: Object,
      default: () => ({
        name: '',
        description: '',
        father: undefined,
      }),
    },
  },
  data() {
    return {
      categories: [],
      categoryData: {
        name: '',
        description: '',
        father: undefined,
      },
    }
  },
  computed: {
    category() {
      return Object.assign(this.categoryData, this.value)
    },
  },
  created() {
    Object.assign(this.categoryData, this.value)
    this.$apollo
      .query({
        query: GetAllCategories,
      })
      .then((response) => {
        this.categories = response.data.GetAllCategories.map((item) => ({
          text: item.name,
          value: item.id,
        })).filter((item) => item.value !== this.category.id)
      })
  },
  methods: {
    save() {
      this.$emit('save', this.category)
    },
  },
}
</script>

<style></style>
