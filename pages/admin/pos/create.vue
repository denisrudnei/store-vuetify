<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="pos.name" label="Name" outlined />
            </v-col>
            <v-col cols="12">
              <v-btn
                class="primary white--text"
                :disabled="!pos.name.length"
                @click="save"
              >
                Save
                <v-icon right>{{ icons.mdiContentSave }}</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mdiContentSave } from '@mdi/js'
import { CreatePOS } from '../../../graphql/mutation/admin/pos/CreatePOS'
import { GetPOS } from '~/graphql/query/admin/GetPOS'
export default {
  data() {
    return {
      icons: {
        mdiContentSave,
      },
      pos: {
        name: '',
      },
    }
  },
  methods: {
    save() {
      this.$apollo
        .mutate({
          mutation: CreatePOS,
          variables: {
            pos: this.pos,
          },
          awaitRefetchQueries: true,
          refetchQueries: [{ query: GetPOS }],
        })
        .then(() => {
          this.$toast.show('Saved', {
            duration: 1000,
          })
          this.pos.name = ''
        })
    },
  },
}
</script>

<style></style>
