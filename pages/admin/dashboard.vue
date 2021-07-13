<template>
  <v-row>
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
    <v-navigation-drawer fixed right clipped app>
      <v-text-field outlined class="mx-3 mt-4" label="Search" />
      <v-list>
        <v-list-group prepend-icon="mdi-label">
          <template #activator>
            <v-list-item-title> Categories </v-list-item-title>
          </template>
          <v-list-item to="/admin/dashboard">
            <v-list-item-content>
              <v-list-item-title> Top 10 categories</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon color="primary">mdi-label</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list-group>
        <v-list-group prepend-icon="mdi-tag-multiple">
          <template #activator>
            <v-list-item-title> Products </v-list-item-title>
          </template>
          <v-list-item to="/admin/dashboard">
            <v-list-item-content>
              <v-list-item-title> Top 10 products </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon color="primary">mdi-tag-multiple</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
  </v-row>
</template>

<script>
import faker from 'faker'
export default {
  data() {
    return {
      items: Array.from({ length: 12 }, (_, i) => (i += 1)).map((item) => ({
        id: item,
        name: faker.commerce.productName(),
        values: Array.from({ length: 5 }, (_, __) =>
          Math.floor(Math.random() * 15)
        ),
      })),
    }
  },
}
</script>

<style></style>
