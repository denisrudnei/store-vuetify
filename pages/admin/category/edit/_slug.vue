<template>
  <create v-if="category" :value="category" @save="update" />
</template>

<script>
import { EditCategory } from '../../../../graphql/mutation/category/EditCategory'
import create from '~/components/category/create-category.vue'
import { GetCategoryByNameEdit } from '~/graphql/query/category/GetCategoryByNameEdit'
import { GetAllCategories } from '~/graphql/query/category/GetAllCategories'
import { GetCategories } from '~/graphql/query/category/GetCategories'
export default {
  components: { create },
  data() {
    return {
      category: undefined,
    }
  },
  created() {
    this.$apollo
      .query({
        query: GetCategoryByNameEdit,
        variables: {
          name: this.$route.params.slug,
        },
      })
      .then((response) => {
        await this.$nextTick()
        this.category = {
          ...response.data.GetCategoryByName,
          father: response.data.GetCategoryByName.father
            ? response.data.GetCategoryByName.father.id
            : undefined,
        }
      })
  },
  methods: {
    update(category) {
      this.$apollo
        .mutate({
          mutation: EditCategory,
          variables: {
            id: this.category.id,
            category: {
              name: category.name,
              description: category.description,
              father: category.father,
              productsTypes: category.productsTypes,
              applyToSubs: category.applyToSubs,
            },
          },
          awaitRefetchQueries: true,
          refetchQueries: [
            { query: GetAllCategories },
            { query: GetCategories },
            {
              query: GetCategoryByNameEdit,
              variables: {
                name: this.$route.params.slug,
              },
            },
          ],
        })
        .then(() => {
          this.$toast.show('Updated', {
            duration: 1000,
          })
          this.$router.push('/admin/category')
        })
        .catch(() => {
          this.$toast.error('Failed to update category', {
            duration: 10000,
          })
        })
    },
  },
}
</script>

<style></style>
