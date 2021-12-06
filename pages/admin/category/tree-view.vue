<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-text>
          <v-treeview :items="categories" :load-children="load" open-on-click>
            <template #prepend="{ item }">
              <v-icon>
                {{ item.children ? icons.mdiLabelMultiple : icons.mdiLabel }}
              </v-icon>
            </template>
            <template #label="{ item }">
              <v-list>
                <v-list-item>
                  <v-list-item-content>
                    <span>{{ item.name }}</span>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn
                      class="primary white--text"
                      icon
                      :to="`/admin/category/edit/${item.slug}`"
                    >
                      <v-icon>{{ icons.mdiPencil }}</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </template>
          </v-treeview>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mdiPencil, mdiLabel, mdiLabelMultiple } from '@mdi/js'
import { GetCategoryByNameTree } from '~/graphql/query/category/GetCategoryByNameTree'
import { GetCategoryTree } from '~/graphql/query/category/GetCategoryTree'
export default {
  data() {
    return {
      icons: {
        mdiPencil,
        mdiLabel,
        mdiLabelMultiple,
      },
      categories: [],
    }
  },
  created() {
    this.$apollo
      .query({
        query: GetCategoryTree,
      })
      .then((response) => {
        this.categories = response.data.GetCategories.map((item) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          children: item.subCategories.length ? [] : undefined,
        }))
      })
  },
  methods: {
    load(item) {
      return this.$apollo
        .query({
          query: GetCategoryByNameTree,
          variables: {
            name: item.slug,
            allTypes: true,
          },
        })
        .then((response) => {
          item.children.push(
            ...response.data.GetCategoryByNameTree.subCategories.map((sub) => ({
              id: sub.id,
              name: sub.name,
              slug: sub.slug,
              children: sub.subCategories.length ? [] : undefined,
            }))
          )
          return item.children
        })
    },
  },
}
</script>

<style></style>
