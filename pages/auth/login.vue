<template>
  <v-row align="center" justify="center">
    <v-col>
      <v-card>
        <v-card-title> Login </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="user.username"
                type="email"
                label="E-mail"
                outlined
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="user.password"
                type="password"
                label="Password"
                outlined
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            class="primary white--text"
            :disabled="disabled"
            @click="login"
          >
            <v-icon left>{{ icons.mdiAccount }}</v-icon>
            Login
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mdiAccount } from '@mdi/js'
export default {
  data() {
    return {
      icons: {
        mdiAccount,
      },
      user: {
        username: '',
        password: '',
      },
    }
  },
  computed: {
    disabled() {
      return this.user.username === '' || this.user.password === ``
    },
  },
  methods: {
    login() {
      this.$auth
        .loginWith('local', { data: this.user })
        .then(() => {
          this.$toast.show('Logged', {
            duration: 1000,
          })
        })
        .catch((e) => {
          this.$toast.error(e.response.data.message, {
            duration: 10000,
          })
        })
    },
  },
}
</script>

<style></style>
