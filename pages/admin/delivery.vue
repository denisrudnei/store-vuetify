<template>
  <v-row>
    <v-col cols="12" md="4">
      <v-card>
        <v-card-text> REQUIRED </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card>
        <v-card-text> IN_PRODUCTION </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card>
        <v-card-text> DELIVERY_PROCESS </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      deliveries: [],
    }
  },
}
</script>

<style></style>
