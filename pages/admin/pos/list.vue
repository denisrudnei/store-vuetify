<template>
  <v-row>
    <v-col>
      <v-data-table :items="pos" :headers="headers">
        <template #item.actions="{ item }">
          <v-btn icon class="red--text" @click="remove(item.id)">
            <v-icon>
              {{ icons.mdiDelete }}
            </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { mdiDelete } from '@mdi/js'
import { GetPOS } from '../../../graphql/query/admin/GetPOS'
import { RemovePOS } from '../../../graphql/mutation/admin/pos/RemovePOS'
export default {
  data() {
    return {
      icons: {
        mdiDelete,
      },
      headers: [
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'Hostname',
          value: 'hostname',
        },
        {
          text: 'ID',
          value: 'id',
        },
        {
          text: 'Actions',
          value: 'actions',
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
  methods: {
    remove(id) {
      this.$dialog(`Remove POS ${id}?`).then(async () => {
        await this.$apollo.mutate({
          mutation: RemovePOS,
          variables: {
            id,
          },
          awaitRefetchQueries: true,
          refetchQueries: [{ query: GetPOS }],
        })
        this.pos = this.pos.filter((item) => item.id !== id)
        this.$toast.show('Removed', {
          duration: 1000,
        })
      })
    },
  },
}
</script>

<style></style>
