<template>
  <v-row>
    <v-col cols="12">
      <v-tabs>
        <v-tab to="/admin/purchase/all">All</v-tab>
        <v-tab to="/admin/purchase/normal">Normal</v-tab>
        <v-tab to="/admin/purchase/delivery">Delivery</v-tab>
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
