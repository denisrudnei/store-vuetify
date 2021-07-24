<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col v-if="state === 'LOADING'" cols="12">
          <v-progress-linear color="primary" indeterminate />
        </v-col>
        <v-col v-if="state === 'ERROR'" cols="12">
          <v-alert color="error" outlined prominent> Failed to load</v-alert>
        </v-col>
        <v-col cols="12">
          <v-btn class="primary white--text" @click="fixCategoriesSlug">
            <v-icon left>{{ icons.mdiTag }}</v-icon>
            Fix category slug
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mdiTag } from '@mdi/js'
import { FixCategoriesSlug } from '~/graphql/mutation/category/FixCategoriesSlug'
export default {
  data() {
    return {
      state: 'LOADED',
      icons: {
        mdiTag,
      },
    }
  },
  methods: {
    fixCategoriesSlug() {
      this.state = 'LOADING'
      this.$apollo
        .mutate({
          mutation: FixCategoriesSlug,
        })
        .then(() => {
          this.$toast.show('Updated', {
            duration: 1000,
          })
          this.state = 'LOADED'
        })
        .catch(() => {
          this.state = 'ERROR'
        })
    },
  },
}
</script>

<style></style>
