<template>
  <printer-create v-model="printer" @save="update" />
</template>

<script>
import { GetOnePrinter } from '../../../../graphql/query/admin/printers/GetOnePrinter'
import { UpdatePrinter } from '../../../../graphql/mutation/admin/printer/UpdatePrinter'
import printerCreate from '~/components/printers/printer-create.vue'
import { GetAllPrinters } from '~/graphql/query/admin/printers/GetAllPrinters'
export default {
  components: {
    printerCreate,
  },
  data() {
    return {
      printer: null,
    }
  },
  created() {
    this.$apollo
      .query({
        query: GetOnePrinter,
        variables: {
          id: this.$route.params.id,
        },
      })
      .then((response) => {
        this.printer = response.data.GetOnePrinter
      })
  },
  methods: {
    update(printer) {
      this.$apollo
        .mutate({
          mutation: UpdatePrinter,
          variables: {
            id: this.$route.params.id,
            printer: {
              name: printer.name,
              path: printer.path,
              type: printer.type,
              model: printer.model,
              manufacturer: printer.manufacturer,
              installedIn: printer.installedIn,
            },
          },
          awaitRefetchQueries: true,
          refetchQueries: [{ query: GetAllPrinters }],
        })
        .then(() => {
          this.$toast.show('Printer updated', {
            duration: 1000,
          })
          this.$router.push('/admin/printers/list')
        })
    },
  },
}
</script>

<style></style>
