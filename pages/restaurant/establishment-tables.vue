<template>
  <v-row>
    <v-col v-for="table in tables" :key="table" cols="12" md="4">
      <v-card :dark="isDark" color="red">
        <v-card-title class="white--text">
          {{ table }}
        </v-card-title>
        <v-card-text align="center">
          <v-divider />
          <v-row>
            <v-col cols="12">
              <v-icon size="150" color="white">
                {{ icons.mdiSilverware }}
              </v-icon>
            </v-col>
            <v-col cols="12">
              <v-divider />
              <v-btn icon color="white">
                <v-icon>
                  {{ icons.mdiBellAlert }}
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mdiSilverware, mdiBellAlert } from '@mdi/js'
import theme from '~/mixins/theme'
export default {
  mixins: [theme],
  data() {
    return {
      icons: {
        mdiSilverware,
        mdiBellAlert,
      },
      tables: ['table 1', 'table 2'],
    }
  },
}
</script>

<style></style>
