<template>
  <create @save="save" />
</template>

<script>
import { CreateProduct } from '../../../graphql/mutation/product/CreateProduct'
import { AllProductsPage } from '../../../graphql/query/product/AllProductsPage'
import create from '@/components/product/create.vue'
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
              amount: Number(product.amount),
              description: product.description,
              category: product.category,
              type: product.type,
            },
          },
          awaitRefetchQueries: true,
          refetchQueries: [
            { query: GetProducts },
            {
              query: AllProductsPage,
              variables: {
                search: {
                  name: '',
                },
              },
            },
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
