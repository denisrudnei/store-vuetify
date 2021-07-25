<template>
  <create @save="save" />
</template>

<script>
import create from '@/components/product/create.vue'
import { CreateProduct } from '../../../graphql/mutation/product/CreateProduct'
import { GetProducts } from '~/graphql/query/product/GetProducts'
export default {
  components: { create },
  methods: {
    save(product) {
      this.$apollo
        .mutate({
          mutation: CreateProduct,
          variables: {
            product: {
              name: product.name,
              price: product.price,
              description: product.description,
              category: product.category,
            },
          },
          awaitRefetchQueries: true,
          refetchQueries: [{ query: GetProducts }],
        })
        .then(() => {
          this.$toast.show('Created', {
            duration: 100,
          })
        })
    },
  },
}
</script>

<style></style>
