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
          <v-btn class="primary white--text" @click="login">
            <v-icon left>mdi-account</v-icon>
            Login
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
    }
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
        .catch(() => {
          this.$toast.error('Failed to login', {
            duration: 10000,
          })
        })
    },
  },
}
</script>

<style></style>
