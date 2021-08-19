<template>
  <v-row>
    <v-col cols="12">
      <v-row justify="center" align="center">
        <v-col v-for="item in summary" :key="item.name" cols="12" md="4">
          <v-card color="primary" dark>
            <v-card-text align="center">
              <span class="text-h4">{{ item.name }}</span>
              <v-divider class="my-2" />
              <span v-if="item.type === 'COUNT'" class="text-h5">
                {{ item.value }}
              </span>
              <span v-if="item.type === 'PRICE'" class="text-h5">
                {{ item.value | dinero }}
              </span>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
    <v-navigation-drawer fixed right clipped app :mini-variant="mini">
      <v-list>
        <v-list-item @click="mini = !mini">
          <v-list-item-action>
            <v-icon>{{ icons.mdiApps }}</v-icon>
          </v-list-item-action>
          <v-list-item-content> Hide </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-text-field v-if="!mini" outlined class="mx-3 mt-4" label="Search" />
      <v-list v-if="!mini">
        <v-list-group :prepend-icon="icons.mdiLabel">
          <template #activator>
            <v-list-item-title> Categories </v-list-item-title>
          </template>
          <v-list-item to="/admin/dashboard">
            <v-list-item-content>
              <v-list-item-title> Top 10 categories</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon color="primary">{{ icons.mdiLabel }}</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list-group>
        <v-list-group :prepend-icon="icons.mdiTagMultiple">
          <template #activator>
            <v-list-item-title> Products </v-list-item-title>
          </template>
          <v-list-item to="/admin/dashboard">
            <v-list-item-content>
              <v-list-item-title> Top 10 products </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon color="primary">{{ icons.mdiTagMultiple }}</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
  </v-row>
</template>

<script>
import { mdiLabel, mdiTagMultiple, mdiApps } from '@mdi/js'
import { GetSummary } from '../../../graphql/query/admin/GetSummary'
export default {
  data() {
    return {
      icons: {
        mdiLabel,
        mdiTagMultiple,
        mdiApps,
      },
      mini: true,
      summary: [],
    }
  },
  created() {
    this.$apollo
      .query({
        query: GetSummary,
      })
      .then((response) => {
        this.summary = response.data.GetSummary
      })
  },
}
</script>

<style></style>
