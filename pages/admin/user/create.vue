<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col>
          <v-text-field outlined label="Name"> </v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn class="primary white--text">
        Save
        <v-icon right>{{ icons.mdiCheckAll }}</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mdiCheckAll } from '@mdi/js'
export default {
  data() {
    return {
      icons: {
        mdiCheckAll,
      },
    }
  },
}
</script>

<style></style>
