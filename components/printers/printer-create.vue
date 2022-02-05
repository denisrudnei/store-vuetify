<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="printer.name" outlined label="Printer name" />
        </v-col>
        <v-col cols="12" md="4">
          <v-autocomplete
            v-model="printer.type"
            outlined
            label="Type"
            :items="types"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="printer.manufacturer"
            outlined
            label="Manufacturer"
          />
        </v-col>
        <v-col cols="12" md="4">
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
            :value-comparator="(a, b) => a.id == b.id"
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
import { GetPrinterInfo } from '../../graphql/query/admin/printers/GetPrinterInfo'

export default {
  props: {
    value: {
      type: Object,
      default: () => ({
        type: 'THERMAL',
        name: '',
        path: '',
        manufacturer: '',
        model: '',
        installedIn: {
          id: undefined,
          name: undefined,
        },
      }),
    },
  },
  data() {
    return {
      pos: [],
      icons: {
        mdiContentSave,
      },
      types: [],
      printerData: {
        type: 'THERMAL',
        name: '',
        path: '',
        manufacturer: '',
        model: '',
        installedIn: undefined,
      },
    }
  },

  computed: {
    printer() {
      return Object.assign(this.printerData, this.value)
    },
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
        query: GetPrinterInfo,
      })
      .then((response) => {
        this.pos = response.data.GetPOS.map((pos) => ({
          text: pos.name,
          value: pos,
        }))
        this.types = response.data.GetPrinterTypes
      })
  },
  methods: {
    save() {
      this.$emit('save', this.printer)
    },
  },
}
</script>

<style></style>
