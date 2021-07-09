<template>
  <v-row align="center" justify="center">
    <v-col>
      <v-card>
        <v-card-title> Register </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="user.name" label="Name" outlined />
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="user.email" label="E-mail" outlined />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="user.password"
                label="Password"
                outlined
                type="password"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field label="Password" outlined type="password" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn class="primary white--text" @click="register">
            <v-icon left>mdi-account</v-icon>
            Register
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  auth: false,
  data() {
    return {
      user: {
        name: '',
        email: '',
        password: '',
      },
    }
  },
  methods: {
    register() {
      this.$axios
        .post('/auth/register', this.user)
        .then(() => {
          this.$toast.show('Registered', {
            duration: 1000,
          })
          this.$router.push('/auth/login')
        })
        .catch(() => {
          this.$toast.error('Failed to register', {
            duration: 10000,
          })
        })
    },
  },
}
</script>

<style></style>
