<template>
  <v-row>
    <v-col>
      <v-data-table :headers="headers" :items="users">
        <template #item.image="{ item }">
          <v-avatar size="56">
            <v-img :src="item.image" />
          </v-avatar>
        </template>
        <template #item.active="{ item }">
          <v-checkbox :input-value="item.active" readonly />
        </template>
      </v-data-table>
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
          text: 'Active',
          value: 'active',
        },
        {
          text: 'Image',
          value: 'image',
        },
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
