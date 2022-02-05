<template>
  <printer-create @save="save" />
</template>

<script>
import { GetAllPrinters } from '~/graphql/query/admin/printers/GetAllPrinters'
import printerCreate from '~/components/printers/printer-create.vue'
import { CreatePrinter } from '~/graphql/mutation/admin/printer/CreatePrinter'
export default {
  components: { printerCreate },

  methods: {
    save(printer) {
      this.$apollo
        .mutate({
          mutation: CreatePrinter,
          variables: {
            printer: {
              ...printer,
              installedIn: printer.installedIn.id,
            },
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
