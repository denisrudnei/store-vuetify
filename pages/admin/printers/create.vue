<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="printer.name" outlined label="Printer name" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="printer.manufacturer"
            outlined
            label="Manufacturer"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="printer.model" outlined label="Model" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="printer.path" outlined label="Path" />
        </v-col>
        <v-col cols="12" md="6">
          <v-autocomplete
            v-model="printer.installedIn"
            outlined
            label="Installed in"
            :items="pos"
          />
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn class="primary white--text" :disabled="disabled" @click="save">
        Save
        <v-icon right>{{ icons.mdiContentSave }}</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mdiContentSave } from '@mdi/js'
import { CreatePrinter } from '../../../graphql/mutation/admin/printer/CreatePrinter'
import { GetPOS } from '~/graphql/query/admin/GetPOS'
import { GetAllPrinters } from '~/graphql/query/admin/printers/GetAllPrinters'
export default {
  data() {
    return {
      pos: [],
      icons: {
        mdiContentSave,
      },
      printer: {
        name: '',
        path: '',
        manufacturer: '',
        model: '',
        installedIn: undefined,
      },
    }
  },
  computed: {
    disabled() {
      return (
        !this.printer.name.length ||
        !this.printer.path.length ||
        !this.printer.manufacturer.length ||
        !this.printer.model.length ||
        this.printer.installedIn === undefined
      )
    },
  },
  created() {
    this.$apollo
      .query({
        query: GetPOS,
      })
      .then((response) => {
        this.pos = response.data.GetPOS.map((pos) => ({
          text: pos.name,
          value: pos.id,
        }))
      })
  },
  methods: {
    save() {
      this.$apollo
        .mutate({
          mutation: CreatePrinter,
          variables: {
            printer: this.printer,
          },
          awaitRefetchQueries: true,
          refetchQueries: [{ query: GetAllPrinters }],
        })
        .then(() => {
          this.$toast.show('Created', {
            duration: 1000,
          })
          this.$router.push('/admin/printers/list')
        })
    },
  },
}
</script>

<style></style>
