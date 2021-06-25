<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <span class="title">Categories</span>
    </v-col>
    <v-col
      v-for="category in categories"
      :key="category.id"
      cols="12"
      sm="8"
      md="6"
    >
      <v-card :to="`/categories/${category.name}`">
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
  computed: {
    categories() {
      return this.$store.getters['category/getCategories']
    },
  },
}
</script>
