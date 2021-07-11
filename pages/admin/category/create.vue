<template>
  <create @save="save" />
</template>

<script>
import create from '~/components/category/create.vue'
import { CreateCategory } from '~/graphql/mutation/category/CreateCategory'
import { GetAllCategories } from '~/graphql/query/category/GetAllCategories'
import { GetCategories } from '~/graphql/query/category/GetCategories'
export default {
  components: { create },
  methods: {
    save(category) {
      this.$apollo
        .mutate({
          mutation: CreateCategory,
          variables: {
            category,
          },
          awaitRefetchQueries: true,
          refetchQueries: [
            { query: GetAllCategories },
            { query: GetCategories },
          ],
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
