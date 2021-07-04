<template>
  <v-row>
    <v-col>
      <v-data-table :headers="headers"></v-data-table>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        {
          text: 'Name',
          value: 'name',
        },
      ],
    }
  },
}
</script>

<style></style>
