<template>
  <v-app dark>
    <v-container>
      <v-card tile elevation="0">
        <v-card-text>
          <v-row align="center" justify="center">
            <v-col cols="12" align="center">
              <v-icon size="200">{{
                error.statusCode === 404
                  ? 'mdi-link-variant-off'
                  : 'mdi-alert-circle-outline'
              }}</v-icon>
            </v-col>
            <v-col cols="12" align="center">
              <span class="text-h1">{{
                error.statusCode === 404 ? pageNotFound : otherError
              }}</span>
              <v-divider class="pb-3" />
              <NuxtLink to="/" class="text-h2"> Home page </NuxtLink>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred',
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title,
    }
  },
}
</script>

<style scoped>
a {
  text-decoration: none !important;
}
</style>
