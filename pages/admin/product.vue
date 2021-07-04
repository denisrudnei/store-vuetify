<template>
  <v-row>
    <v-col cols="12">
      <v-tabs>
        <v-tab to="/admin/product/list"> List </v-tab>
        <v-tab to="/admin/product/create"> Create </v-tab>
        <v-tab to="/admin/product/inactivated">Inactivated</v-tab>
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
