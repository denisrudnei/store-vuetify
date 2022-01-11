<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="table.name" outlined> </v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { GetTable } from '../../../../../graphql/query/restaurant/GetTable'
export default {
  data() {
    return {
      table: {
        name: '',
        inUse: false,
      },
    }
  },
  created() {
    this.$apollo
      .query({
        query: GetTable,
        variables: {
          id: this.$router.currentRoute.params.id,
        },
      })
      .then((response) => {
        this.table = response.data.GetTable
      })
  },
}
</script>

<style></style>
