<template>
  <v-row>
    <v-col cols="12">
      <v-tabs>
        <v-tab to="/admin/pos/list">List</v-tab>
        <v-tab to="/admin/pos/create">Create</v-tab>
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
