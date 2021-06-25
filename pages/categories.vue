<template>
  <v-row>
    <v-col cols="12">
      <v-tabs>
        <v-tab to="/categories/1">Diversos 1</v-tab>
        <v-tab to="/categories/2">Diversos 2</v-tab>
        <v-tab to="/categories/3">Diversos 3</v-tab>
        <v-tab to="/categories/4">Diversos 4</v-tab>
      </v-tabs>
    </v-col>
    <v-col cols="12">
      <nuxt-child />
    </v-col>
  </v-row>
</template>

<script>
export default {}
</script>

<style></style>
