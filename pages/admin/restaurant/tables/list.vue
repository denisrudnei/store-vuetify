<template>
  <v-row>
    <v-col cols="12">
      <v-data-table :items="items" :headers="headers">
        <template #item.actions="{ item }">
          <v-btn icon :to="`/admin/restaurant/tables/edit/${item.id}`">
            <v-icon>{{ icons.mdiPencil }}</v-icon>
          </v-btn>
        </template>
        <template #item.inUse="{ item }">
          <v-checkbox :input-value="item.inUse" readonly />
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { mdiPencil } from '@mdi/js'
import { GetTables } from '~/graphql/query/restaurant/GetTables'
export default {
  data() {
    return {
      icons: {
        mdiPencil,
      },
      items: [],
      headers: [
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'Status',
          value: 'inUse',
        },
        {
          text: 'Actions',
          value: 'actions',
        },
      ],
    }
  },
  created() {
    this.$apollo
      .query({
        query: GetTables,
      })
      .then((response) => {
        this.items = response.data.GetTables
      })
  },
}
</script>

<style></style>
