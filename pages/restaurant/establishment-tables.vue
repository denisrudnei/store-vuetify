<template>
  <v-row>
    <v-col v-for="table in tables" :key="table.id" cols="12" md="4">
      <v-card :dark="table.inUse" :color="table.inUse ? 'red' : 'white'">
        <v-card-title
          :class="{ 'white--text': table.inUse, 'black--text': !table.inUse }"
        >
          {{ table.id }} - {{ table.name }}
        </v-card-title>
        <v-card-text align="center">
          <v-divider />
          <v-row>
            <v-col cols="12">
              <v-icon size="150" :color="table.inUse ? 'white' : 'black'">
                {{ icons.mdiSilverware }}
              </v-icon>
            </v-col>
            <v-col cols="12">
              <v-divider />
              <v-btn icon :color="table.inUse ? 'white' : 'black'">
                <v-icon>
                  {{ icons.mdiBellAlert }}
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mdiSilverware, mdiBellAlert } from '@mdi/js'
import { GetTables } from '~/graphql/query/restaurant/GetTables'
import { EstablishmentTableStatusChanged } from '~/graphql/subscription/restaurant/EstablishmentTableStatusChanged'
import { EstablishmentTableCreated } from '~/graphql/subscription/restaurant/EstablishmentTableCreated'
import theme from '~/mixins/theme'
export default {
  mixins: [theme],
  data() {
    return {
      icons: {
        mdiSilverware,
        mdiBellAlert,
      },
    }
  },
  computed: {
    tables: {
      get() {
        return this.$store.getters['establishment-table/getTables']
      },
      set(value) {
        this.$store.commit('establishment-table/setTables', value)
      },
    },
  },
  created() {
    this.$apollo
      .query({
        query: GetTables,
      })
      .then((response) => {
        this.tables = response.data.GetTables
      })
  },
  mounted() {
    const vue = this
    const establishmentTableStatusChangedSubscriber = this.$apollo.subscribe({
      query: EstablishmentTableStatusChanged,
    })

    establishmentTableStatusChangedSubscriber.subscribe({
      next({ data }) {
        vue.$store.commit(
          'establishment-table/updateTable',
          data.EstablishmentTableStatusChanged
        )
      },
    })

    const establishmentTableCreatedSubscriber = this.$apollo.subscribe({
      query: EstablishmentTableCreated,
    })

    establishmentTableCreatedSubscriber.subscribe({
      next({ data }) {
        vue.$store.commit(
          'establishment-table/addTable',
          data.EstablishmentTableCreated
        )
      },
    })
  },
}
</script>

<style></style>
