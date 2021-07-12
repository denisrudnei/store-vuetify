<template>
  <v-row>
    <v-col>
      <v-data-table :headers="headers" :items="users"></v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { GetUsers } from '../../../graphql/query/user/GetUsers'
export default {
  data() {
    return {
      headers: [
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'E-mail',
          value: 'email',
        },
      ],
      users: [],
    }
  },
  created() {
    this.$apollo
      .query({
        query: GetUsers,
      })
      .then((response) => {
        this.users = response.data.GetUsers
      })
  },
}
</script>

<style></style>
