<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="product.name" outlined label="Name" />
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="product.description"
            outlined
            label="Description"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="product.price"
            type="number"
            label="Price"
            outlined
          />
        </v-col>
        <v-col cols="12">
          <v-autocomplete
            v-model="product.category"
            label="Category"
            outlined
            :items="categories"
          />
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn class="primary white--text" @click="save">
        Save <v-icon right>mdi-check-all</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { CreateProduct } from '../../../graphql/mutation/product/CreateProduct'
import { GetAllCategories } from '~/graphql/query/category/GetAllCategories'
export default {
  data() {
    return {
      product: {
        name: '',
        description: '',
        price: 0,
        category: undefined,
      },
      categories: [],
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
          mutation: CreateProduct,
          variables: {
            product: {
              ...this.product,
              price: parseFloat(this.product.price.replace(',', '.')),
            },
          },
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
