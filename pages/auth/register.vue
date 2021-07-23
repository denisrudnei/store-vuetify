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
                :type="getType()"
                :append-icon="getIcon()"
                @click:append="toggleIcon()"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            class="primary white--text"
            :disabled="inactive"
            @click="register"
          >
            <v-icon left>{{ icons.mdiAccount }}</v-icon>
            Register
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mdiAccount, mdiEye, mdiEyeOff } from '@mdi/js'
export default {
  auth: false,
  data() {
    return {
      icons: {
        mdiAccount,
      },
      user: {
        name: '',
        email: '',
        password: '',
      },
      repeatPassword: '',
      showPassword: false,
      showRepeatPassword: false,
    }
  },
  computed: {
    inactive() {
      return (
        this.user.name === '' ||
        this.user.email === '' ||
        this.user.password === ''
      )
    },
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
    getIcon() {
      return this.showPassword ? mdiEyeOff : mdiEye
    },
    getType() {
      return this.showPassword ? 'text' : 'password'
    },
    toggleIcon() {
      return (this.showPassword = !this.showPassword)
    },
  },
}
</script>

<style></style>
