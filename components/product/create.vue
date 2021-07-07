<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="product.name" outlined label="Name" />
        </v-col>
        <v-col cols="12" class="black--text">
          <client-only>
            <ckeditor v-model="product.description" :editor="editor" dark />
          </client-only>
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
import { GetAllCategories } from '~/graphql/query/category/GetAllCategories'
export default {
  props: {
    value: {
      type: Object,
      default: () => ({
        name: '',
        description: '',
        price: '0',
        category: undefined,
      }),
    },
  },
  data() {
    return {
      editor: undefined,
      productData: {
        name: '',
        description: '',
        price: '0',
        category: undefined,
      },
      categories: [],
    }
  },
  computed: {
    product() {
      return Object.assign(this.productData, this.value)
    },
  },
  mounted() {
    this.editor = require('@ckeditor/ckeditor5-build-classic')
  },
  created() {
    Object.assign(this.productData, this.value)
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
      this.$emit('save', {
        ...this.product,
        price: parseFloat(this.product.price.toString().replace(',', '.')),
      })
      this.product.name = ''
      this.product.description = ''
      this.product.price = '0'
      this.product.category = undefined
    },
  },
}
</script>

<style></style>
