<template>
  <v-row>
    <v-col cols="12">
      <v-tabs>
        <v-tab to="/restaurant/orders">Orders</v-tab>
        <v-tab to="/restaurant/establishment-tables">Tables</v-tab>
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
