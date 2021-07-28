<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-title> Summary </v-card-title>
        <v-card-text>
          <v-row justify="center" align="center">
            <v-col v-for="item in summary" :key="item.name" cols="12" md="4">
              <v-card color="primary" dark>
                <v-card-text align="center">
                  <span class="text-h4">{{ item.name }}</span>
                  <v-divider class="my-2" />
                  <span class="text-h5">{{ item.value }}</span>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col v-for="card in items" :key="card.id" cols="12" md="4">
      <v-card color="primary" dark class="mx-auto text-center" tile>
        <v-card-text>
          <v-sheet color="rgba(0, 0, 0, .12)">
            <v-sparkline
              :value="card.values"
              color="rgba(255, 255, 255, .7)"
              height="100"
              line-width="2"
              padding="10"
              smooth
            >
              <template #label="item"> ${{ item.value }} </template>
            </v-sparkline>
          </v-sheet>
        </v-card-text>
        <v-card-text class="title">{{ card.name }}</v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn class="primary white--text" block text>View details</v-btn>
        </v-card-actions>
      </v-card>
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
import faker from 'faker'
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
      items: Array.from({ length: 12 }, (_, i) => (i += 1)).map((item) => ({
        id: item,
        name: faker.commerce.productName(),
        values: Array.from({ length: 5 }, (_, __) =>
          Math.floor(Math.random() * 15)
        ),
      })),
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
