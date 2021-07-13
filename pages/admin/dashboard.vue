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
              padding="24"
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
