<template>
  <v-card>
    <v-card-title>Social networks to show </v-card-title>
    <v-card-text>
      <v-row align="center" justify="center">
        <v-col cols="12" md="6">
          <v-text-field label="Facebook" append-icon="mdi-facebook" outlined />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="Youtube" append-icon="mdi-youtube" outlined />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="Twitter" append-icon="mdi-twitter" outlined />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="Discord" append-icon="mdi-discord" outlined />
        </v-col>
        <v-col cols="12">
          <v-btn class="primary white--text">
            Save
            <v-icon right>mdi-check-all</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {}
</script>

<style></style>
