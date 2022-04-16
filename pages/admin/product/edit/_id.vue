<template>
  <create v-if="product" :value="product" @save="update" />
</template>

<script>
import { EditProduct } from '../../../../graphql/mutation/product/EditProduct'
import create from '~/components/product/create-product.vue'
import { GetProductForEdit } from '~/graphql/query/product/GetProductForEdit'
import { GetProducts } from '~/graphql/query/product/GetProducts'
import { GetProductInfo } from '~/graphql/query/GetProductListInfo'
export default {
  components: { create },
  data() {
    return {
      product: undefined,
    }
  },
  created() {
    this.$apollo
      .query({
        query: GetProductForEdit,
        variables: {
          id: this.$route.params.id,
        },
      })
      .then((response) => {
        await this.$nextTick()
        this.product = {
          ...response.data.GetProductForEdit,
          category: response.data.GetProductForEdit.category.id,
        }
      })
  },
  methods: {
    update(product) {
      this.$apollo
        .mutate({
          mutation: EditProduct,
          variables: {
            id: this.$route.params.id,
            product: {
              category: product.category,
              name: product.name,
              barcode: product.barcode,
              price: product.price,
              amount: Number(product.amount),
              description: product.description,
              type: product.type,
            },
          },
          awaitRefetchQueries: true,
          refetchQueries: [{ query: GetProducts }, { query: GetProductInfo }],
        })
        .then(() => {
          this.$toast.show('Updated', {
            duration: 1000,
          })
          this.$router.push('/admin/product/list')
        })
    },
  },
}
</script>

<style></style>
