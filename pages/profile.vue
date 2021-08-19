<template>
  <v-row>
    <v-col cols="12">
      <v-tabs>
        <v-tab to="/profile/info">Info</v-tab>
        <v-tab to="/profile/purchases">Purchases</v-tab>
        <v-tab to="/profile/notifications"> Notifications </v-tab>
      </v-tabs>
    </v-col>
    <v-col cols="12">
      <nuxt-child />
    </v-col>
  </v-row>
</template>

<script>
export default {
  head: {
    title: 'Profile',
  },
}
</script>

<style></style>
