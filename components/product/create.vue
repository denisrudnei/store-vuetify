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
        <v-col cols="12">
          <v-tabs>
            <v-tab>Images</v-tab>
            <v-tab-item>
              <v-card>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="8">
                      <v-card v-if="selected">
                        <v-img :src="selected" width="100%" />
                      </v-card>
                      <v-alert
                        v-if="!selected"
                        :icon="icons.mdiImageOff"
                        prominent
                        outlined
                        color="warning"
                      >
                        No image selected
                      </v-alert>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-row>
                        <v-col cols="12">
                          <v-file-input
                            v-model="images"
                            :disabled="!product || !product.id"
                            label="Select images"
                            outlined
                            multiple
                            @change="previewImages"
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-btn
                            class="primary"
                            block
                            :disabled="!newImages.length"
                            @click="uploadImages"
                          >
                            <v-icon left>{{ icons.mdiImage }}</v-icon>
                            Upload new images
                          </v-btn>
                        </v-col>
                        <v-col cols="12">
                          <v-list>
                            <v-list-item
                              v-for="image in allImages"
                              :key="image"
                              @click="selected = image"
                            >
                              <v-list-item-content>
                                <v-img :src="image" height="100" width="100" />
                              </v-list-item-content>
                              <v-list-item-action @click="removeImage(image)">
                                <v-icon>{{ icons.mdiDelete }}</v-icon>
                              </v-list-item-action>
                            </v-list-item>
                          </v-list>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn class="primary white--text" :disabled="disabled" @click="save">
        Save <v-icon right>{{ icons.mdiCheckAll }}</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mdiCheckAll, mdiImage, mdiImageOff, mdiDelete } from '@mdi/js'
import { RemoveImage } from '@/graphql/mutation/product/RemoveImage'
import { GetAllCategories } from '~/graphql/query/category/GetAllCategories'
export default {
  props: {
    value: {
      type: Object,
      default: () => ({
        name: '',
        description: '',
        price: '0',
        images: [],
        category: undefined,
      }),
    },
  },
  data() {
    return {
      icons: {
        mdiCheckAll,
        mdiImage,
        mdiImageOff,
        mdiDelete,
      },
      selected: undefined,
      images: [],
      newImages: [],
      editor: undefined,
      productData: {
        name: '',
        description: '',
        price: '0',
        images: [],
        category: undefined,
      },
      categories: [],
    }
  },
  computed: {
    product() {
      return Object.assign(this.productData, this.value)
    },
    allImages() {
      if (!this.product) return []
      return this.product.images.concat(this.newImages)
    },
    disabled() {
      return (
        this.product.name === '' ||
        this.product.description === '' ||
        !this.product.price ||
        !this.product.category
      )
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
    isNewImage(image) {
      return this.newImages.includes(image)
    },
    previewImages() {
      const vue = this
      for (const index in this.images) {
        const fileReader = new FileReader()
        fileReader.onloadend = function () {
          vue.newImages.push(fileReader.result)
        }

        fileReader.readAsDataURL(this.images[index])
      }
    },
    uploadImages() {
      const formData = new FormData()
      for (const index in this.images) {
        formData.append('images', this.images[index])
      }
      this.$axios
        .post(`/product/${this.product.id}/images`, formData)
        .then(() => {
          this.$toast.show('Uplaoded', {
            duration: 1000,
          })
        })
    },
    removeImage(image) {
      if (this.isNewImage(image)) {
        this.newImages = this.newImages.filter((item) => item !== image)
        this.selected = undefined
        this.$toast.show('Removed', {
          duration: 1000,
        })
      } else {
        this.$apollo
          .mutate({
            mutation: RemoveImage,
            variables: {
              product: this.product.id,
              image,
            },
          })
          .then(() => {
            this.$toast.show('Removed', {
              duration: 1000,
            })

            this.newImages = this.newImages.filter((item) => item !== image)
            this.product.images = this.product.images.filter(
              (item) => item !== image
            )
          })
          .catch(() => {
            this.$toast.error('Failed to remove image', {
              duration: 1000,
            })
          })
      }
    },
  },
}
</script>

<style></style>
