<template>
  <v-row>
    <v-col cols="12">
      <v-tabs>
        <v-tab to="/admin/dashboard"> Dashboard </v-tab>
        <v-tab to="/admin/purchase">Purchases</v-tab>
        <v-tab to="/admin/product">Products</v-tab>
        <v-tab to="/admin/category">Categories</v-tab>
        <v-tab to="/admin/user"> Users</v-tab>
        <v-tab to="/admin/customization">Customization</v-tab>
        <v-tab to="/admin/social-networks">Social networks</v-tab>
        <v-tab to="/admin/management">Management</v-tab>
      </v-tabs>
    </v-col>
    <v-col cols="12">
      <nuxt-child />
    </v-col>
  </v-row>
</template>

<script>
import AdminMiddleware from '../middleware/AdminMiddleware'
export default {
  middleware: [AdminMiddleware],
}
</script>

<style></style>
