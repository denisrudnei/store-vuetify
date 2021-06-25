<template>
  <v-row justify="center" align="center">
    <v-col
      v-for="category in categories"
      :key="category.id"
      cols="12"
      sm="8"
      md="6"
    >
      <v-card :to="`/categories/${category.id}`">
        <v-img
          :src="`https://picsum.photos/800/600/?${Math.random()}`"
          :aspect-ratio="16 / 9"
        />
        <v-card-title>
          {{ category.name }}
        </v-card-title>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      categories: [
        {
          id: 1,
          name: 'Diversos',
        },
        {
          id: 2,
          name: 'Diversos 2',
        },
      ],
    }
  },
}
</script>
