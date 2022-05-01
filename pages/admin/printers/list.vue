<template>
  <v-data-table :headers="headers" :items="printers">
    <template #item.installedIn="{ item }">
      <span> {{ item.installedIn.name }}</span>
    </template>
    <template #item.actions="{ item }">
      <v-btn class="primary--text" :to="`/admin/printers/edit/${item.id}`" icon>
        <v-icon>{{ icons.mdiPencil }}</v-icon>
      </v-btn>
      <v-btn class="red--text" icon @click="remove(item.id)">
        <v-icon>{{ icons.mdiDelete }}</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import { mdiPencil, mdiDelete } from '@mdi/js'
import { GetAllPrinters } from '../../../graphql/query/admin/printers/GetAllPrinters'
import { RemovePrinter } from '../../../graphql/query/admin/printers/RemovePrinter'
export default {
  data() {
    return {
      icons: {
        mdiPencil,
        mdiDelete,
      },
      printers: [],
      headers: [
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'Type',
          value: 'type',
        },
        {
          text: 'Manufacturer',
          value: 'manufacturer',
        },
        {
          text: 'Model',
          value: 'model',
        },
        {
          text: 'Path',
          value: 'path',
        },
        {
          text: 'Installed In',
          value: 'installedIn',
        },
        {
          text: 'Actions',
          value: 'actions',
        },
      ],
    }
  },
  created() {
    this.$apollo.query({ query: GetAllPrinters }).then((response) => {
      this.printers = response.data.GetAllPrinters
    })
  },
  methods: {
    remove(id) {
      this.$dialog('Remove printer?')
        .then(() => {
          this.$apollo
            .mutate({
              mutation: RemovePrinter,
              variables: {
                id,
              },
              awaitRefetchQueries: true,
              refetchQueries: [{ query: GetAllPrinters }],
            })
            .then(() => {
              this.printers = this.printers.filter(
                (printer) => printer.id !== id
              )
            })
        })
        .catch(() => {
          this.$toast.show('Canceled', {
            duration: 1000,
          })
        })
    },
  },
}
</script>

<style></style>
