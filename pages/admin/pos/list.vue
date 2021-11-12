<template>
  <v-row>
    <v-col>
      <v-data-table :items="pos" :headers="headers" />
    </v-col>
  </v-row>
</template>

<script>
import { GetPOS } from '../../../graphql/query/admin/GetPOS'
export default {
  data() {
    return {
      headers: [
        {
          text: 'ID',
          value: 'id',
        },
        {
          text: 'Name',
          value: 'name',
        },
      ],
      pos: [],
    }
  },
  created() {
    this.$apollo.query({ query: GetPOS }).then((response) => {
      this.pos = response.data.GetPOS
    })
  },
}
</script>

<style></style>
