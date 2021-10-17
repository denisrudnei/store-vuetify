<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="table.name" outlined label="Name" />
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn class="primary white--text" :disabled="disabled" @click="save">
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { CreateEstablishmentTable } from '~/graphql/mutation/admin/restaurant/CreateEstablishmentTable'
import { GetTables } from '~/graphql/query/restaurant/GetTables'
export default {
  data() {
    return {
      table: {
        name: '',
      },
    }
  },
  computed: {
    disabled() {
      return this.table.name.length < 3
    },
  },
  methods: {
    save() {
      this.$apollo
        .mutate({
          mutation: CreateEstablishmentTable,
          variables: {
            table: this.table,
          },
          awaitRefetchQueries: true,
          refetchQueries: [{ query: GetTables }],
        })
        .then(() => {
          this.$toast.show('Created', {
            duration: 1000,
          })
          this.table = {
            name: '',
          }
        })
    },
  },
}
</script>

<style></style>
