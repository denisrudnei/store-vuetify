<template>
  <v-row>
    <v-col cols="12" md="8">
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
            <v-col cols="12">
              <v-row>
                <v-col cols="auto">
                  <v-checkbox
                    v-model="applyToSubs"
                    label="Apply to sub categories"
                  >
                  </v-checkbox>
                </v-col>
                <v-col>
                  <v-autocomplete
                    v-model="category.productsTypes"
                    :items="types"
                    outlined
                    label="Type"
                    multiple
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-file-input
                v-model="image"
                outlined
                :disabled="!category.id"
                label="Add image"
                @change="updateImage"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn class="primary white--text" @click="save">
            Save
            <v-icon right>{{ icons.mdiCheckAll }}</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card>
        <v-img :src="imageUrl" />
        <v-card-text>
          {{ category.name }}
        </v-card-text>
        <v-card-actions v-if="category.father">
          <v-chip label>{{ getFather(category.father) }}</v-chip>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mdiCheckAll } from '@mdi/js'
import { GetAllCategories } from '~/graphql/query/category/GetAllCategories'
import { GetProductTypes } from '~/graphql/query/GetProductTypes'
export default {
  props: {
    value: {
      type: Object,
      default: () => ({
        name: '',
        description: '',
        father: undefined,
        image: undefined,
        productsTypes: [],
      }),
    },
  },
  data() {
    return {
      icons: {
        mdiCheckAll,
      },
      categories: [],
      categoryData: {
        name: '',
        description: '',
        father: undefined,
        productsTypes: [],
      },
      image: undefined,
      imageUrl: undefined,
      types: [],
      applyToSubs: false,
    }
  },
  computed: {
    category() {
      return Object.assign(this.categoryData, this.value)
    },
  },
  created() {
    Object.assign(this.categoryData, this.value)

    this.imageUrl = this.category.image
      ? this.category.image
      : '/images/not-set.svg'
    this.$apollo
      .query({
        query: GetAllCategories,
        variables: {
          limit: 10000,
        },
      })
      .then((response) => {
        this.categories = response.data.GetAllCategories.edges
          .map((edge) => edge.node)
          .map((item) => ({
            text: item.name,
            value: item.id,
          }))
          .filter((item) => item.value !== this.category.id)
      })

    this.$apollo
      .query({
        query: GetProductTypes,
      })
      .then((response) => {
        this.types = response.data.GetProductTypes
      })
  },
  methods: {
    save() {
      this.$emit('save', {
        ...this.category,
        applyToSubs: this.applyToSubs,
      })
    },
    updateImage() {
      if (!this.image) return
      const vue = this
      const fileReader = new FileReader()
      fileReader.onloadend = function () {
        vue.imageUrl = fileReader.result
      }
      fileReader.readAsDataURL(this.image)
      const formData = new FormData()
      formData.append('image', this.image)
      this.$axios
        .post(`/category/${this.category.id}/image`, formData)
        .then(() => {
          this.$toast.show('Image uploaded', {
            duration: 1000,
          })
        })
        .catch(() => {
          this.$toast.error('Failed to upload image', {
            duration: 10000,
          })
        })
    },
    getFather(id) {
      if (!this.categories.length) return
      const fatherIndex = this.categories.findIndex(
        (category) => category.value === id
      )
      if (fatherIndex === -1) return
      return this.categories[fatherIndex].text
    },
  },
}
</script>

<style></style>
