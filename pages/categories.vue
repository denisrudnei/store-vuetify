<template>
  <v-row>
    <v-col cols="12">
      <v-tabs>
        <v-tab
          v-for="category in categories"
          :key="category.id"
          :to="`/categories/${category.name}`"
        >
          {{ category.name }}
        </v-tab>
      </v-tabs>
    </v-col>
    <v-col cols="12">
      <nuxt-child />
    </v-col>
  </v-row>
</template>

<script>
import faker from 'faker'
export default {
  data() {
    return {
      categories: Array.from({ length: 5 }, (_, x) => (x += 1)).map((item) => ({
        id: item,
        name: faker.commerce.department(),
      })),
    }
  },
}
</script>

<style></style>
