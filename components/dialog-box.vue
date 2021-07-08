<template>
  <v-dialog v-model="dialog" width="50%" persistent>
    <v-card tile class="pa-2">
      <v-card-title />
      <v-card-text>
        <h1>{{ message }}</h1>
      </v-card-text>
      <v-card-actions>
        <v-row>
          <v-col cols="6">
            <v-btn
              class="primary white--text"
              tile
              block
              @click="updateDialog(true)"
            >
              Ok
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              class="primary white--text"
              tile
              block
              @click="updateDialog(false)"
            >
              Cancel
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  computed: {
    dialog: {
      get() {
        return this.$store.getters['dialog/getDialog']
      },
      set(value) {
        this.$store.commit('dialog/setDialog', value)
      },
    },
    message: {
      get() {
        return this.$store.getters['dialog/getMessage']
      },
      set(value) {
        this.$store.commit('dialog/setMessage', value)
      },
    },
  },
  methods: {
    updateDialog(value) {
      this.dialogBus.$emit('dialogUpdated', value)
    },
  },
}
</script>

<style></style>
