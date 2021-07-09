<template>
  <v-row>
    <v-col cols="12">
      <v-tabs>
        <v-tab to="/auth/login">Login</v-tab>
        <v-tab to="/auth/register">Register</v-tab>
      </v-tabs>
    </v-col>
    <v-col>
      <nuxt-child />
    </v-col>
  </v-row>
</template>

<script>
export default {}
</script>

<style></style>
