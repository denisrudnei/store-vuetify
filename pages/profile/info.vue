<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-title> Personal information </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="10">
              <v-text-field v-model="user.name" outlined label="Name" />
              <v-text-field
                v-model="user.email"
                outlined
                label="Email"
                readonly
              />
              <v-btn class="primary white--text" @click="updateUser">
                Update info
              </v-btn>
              <v-divider class="my-4" />
              <v-card flat>
                <v-card-title class="red--text"> Danger area </v-card-title>
                <v-card-text>
                  <v-text-field
                    v-model="newPassword"
                    outlined
                    label="Password"
                    :type="showNewPassword ? 'text' : 'password'"
                    :append-icon="passwordIcon('showNewPassword')"
                    @click:append="showNewPassword = !showNewPassword"
                  />

                  <v-text-field
                    v-model="repeatNewPassword"
                    outlined
                    label="Confirm password"
                    :type="showRepeatNewPassword ? 'text' : 'password'"
                    :append-icon="passwordIcon('showRepeatNewPassword')"
                    @click:append="
                      showRepeatNewPassword = !showRepeatNewPassword
                    "
                  />
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    class="red white--text"
                    :disabled="!validToReset"
                    @click="reset"
                  >
                    Reset passwrod
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
            <v-divider vertical />
            <v-col cols="12" md="2" class="pl-5">
              <v-img
                src="https://picsum.photos/800/600"
                class="rounded-circle"
                :aspect-ratio="1"
              />
              <v-btn class="primary white--text mt-2" block>Update image</v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-card>
        <v-card-title>Address</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="2">
              <v-text-field outlined label="Zip code"> </v-text-field>
            </v-col>
            <v-col cols="12" md="5">
              <v-text-field outlined label="Country"> </v-text-field>
            </v-col>
            <v-col cols="12" md="5">
              <v-text-field outlined label="City"> </v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field outlined label="Number"> </v-text-field>
            </v-col>
            <v-col cols="12" md="8">
              <v-text-field outlined label="Street"> </v-text-field>
            </v-col>
            <v-col md="6" cols="12">
              <v-text-field outlined label="District"> </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field outlined label="State"> </v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-btn class="primary white--text">
        Save
        <v-icon right>mdi-check-all</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { UpdateUserInfo } from '../../graphql/mutation/user/UpdateUserInfo'
import { ResetPassword } from '../../graphql/mutation/user/ResetPassword'
import { GetActualUser } from '~/graphql/query/user/GetActualUser'
export default {
  data() {
    return {
      user: {
        name: '',
        email: '',
      },
      newPassword: '',
      repeatNewPassword: '',
      showNewPassword: false,
      showRepeatNewPassword: false,
    }
  },
  computed: {
    validToReset() {
      return (
        this.newPassword !== '' && this.newPassword === this.repeatNewPassword
      )
    },
  },
  created() {
    this.$apollo
      .query({
        query: GetActualUser,
      })
      .then((response) => {
        this.user = response.data.GetActualUser
      })
  },
  methods: {
    passwordIcon(field) {
      return this[field] ? 'mdi-eye-off' : 'mdi-eye'
    },
    reset() {
      this.$apollo
        .mutate({
          mutation: ResetPassword,
          variables: {
            newPassword: this.newPassword,
          },
        })
        .then(() => {
          this.$toast.show('Reseted', {
            duration: 1000,
          })
          this.$auth.fetch()
        })
    },
    updateUser() {
      this.$apollo
        .mutate({
          mutation: UpdateUserInfo,
          variables: {
            user: {
              name: this.user.name,
            },
          },
        })
        .then(() => {
          this.$toast.show('Updated', {
            duration: 1000,
          })
        })
    },
  },
}
</script>

<style></style>
