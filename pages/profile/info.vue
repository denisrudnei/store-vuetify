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
            </v-col>
            <v-divider vertical />
            <v-col cols="12" md="2" class="pl-5">
              <v-row>
                <v-col cols="12">
                  <v-img
                    :src="user.image"
                    class="rounded-circle"
                    :aspect-ratio="1"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-file-input
                v-model="image"
                outlined
                label="Select profile image"
                @change="previewImage"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-row>
            <v-col cols="12" md="auto">
              <v-btn
                class="primary white--text"
                :disabled="!image"
                :block="isMobile"
                @click="updateImage"
              >
                Update image
              </v-btn>
            </v-col>
            <v-col cols="12" md="auto">
              <v-btn
                class="primary white--text"
                :block="isMobile"
                @click="updateUser"
              >
                Update info
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-card>
        <v-card-title>Address</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-list>
                <template v-for="address in user.addresses">
                  <v-list-item :key="`${address.id}Item`">
                    <v-list-item-content>
                      {{ address.fullName }}
                    </v-list-item-content>
                    <v-list-item-action @click="editAddress(address)">
                      <v-btn icon>
                        <v-icon>{{ icons.mdiPencil }}</v-icon>
                      </v-btn>
                    </v-list-item-action>
                    <v-list-item-action>
                      <v-btn icon color="red" @click="deleteAdddress(address)">
                        <v-icon>{{ icons.mdiDelete }}</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                  <v-divider :key="`${address.id}Divider`" />
                </template>
              </v-list>
            </v-col>
            <v-col cols="12">
              <v-btn class="primary white--text" @click="addNew">
                Add
                <v-icon right>{{ icons.mdiPlus }}</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-card>
        <v-card-title> Phones </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-list>
                <template v-for="phone in user.phones">
                  <v-list-item :key="`${phone.number}Item`">
                    <v-list-item-action>
                      <v-btn
                        :href="`tel://${phone.number}`"
                        class="primary white--text"
                        icon
                      >
                        <v-icon>{{ icons.mdiPhoneDial }}</v-icon>
                      </v-btn>
                    </v-list-item-action>
                    <v-list-item-content>
                      <span>
                        {{ phone.description }}
                        <v-chip label outlined class="ml-3">
                          {{ phone.number }}
                        </v-chip>
                      </span>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-btn icon color="red" @click="removePhone(phone)">
                        <v-icon>
                          {{ icons.mdiDelete }}
                        </v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                  <v-divider :key="`${phone.number}Divider`" />
                </template>
              </v-list>
            </v-col>
            <v-col cols="12">
              <v-menu v-model="phoneMenu" :close-on-content-click="false">
                <template #activator="{ on }">
                  <v-btn class="primary white--text" v-on="on">
                    Add
                    <v-icon right>{{ icons.mdiCheckAll }}</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title />
                  <v-card-text>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="currentPhoneDescription"
                          label="Description"
                          outlined
                        />
                        <v-text-field
                          v-model="currentPhoneNumber"
                          v-mask="['(##) ####-####', '(##) #####-####']"
                          outlined
                          type="tel"
                          label="Phone"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-btn class="primary white--text" @click="addPhone">
                          Save
                          <v-icon right>{{ icons.mdiCheckAll }}</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-menu>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
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
            @click:append="showRepeatNewPassword = !showRepeatNewPassword"
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
    <v-col cols="12">
      <v-dialog
        v-if="showAddressDialog"
        v-model="showAddressDialog"
        width="75%"
      >
        <address-create
          :value="currentAddress"
          @save="addAddress"
          @update="updateAddress"
        />
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
import {
  mdiCheckAll,
  mdiEye,
  mdiEyeOff,
  mdiPencil,
  mdiPlus,
  mdiDelete,
  mdiPhoneDial,
} from '@mdi/js'
// eslint-disable-next-line import/named
import { TheMask } from 'vue-the-mask'
import { UpdateUserInfo } from '../../graphql/mutation/user/UpdateUserInfo'
import { ResetPassword } from '../../graphql/mutation/user/ResetPassword'
import { CreateAddress } from '../../graphql/mutation/info/CreateAddress'
import { RemoveAddress } from '../../graphql/mutation/info/RemoveAddress'
import { UpdateAddress } from '../../graphql/mutation/info/UpdateAddress'
import { CreatePhone } from '../../graphql/mutation/info/phone/CreatePhone'
import { RemovePhone } from '../../graphql/mutation/info/phone/RemovePhone'
import { GetActualUser } from '~/graphql/query/user/GetActualUser'
import addressCreate from '~/components/address-create.vue'
import theme from '~/mixins/theme'
export default {
  components: { addressCreate },
  directives: {
    TheMask,
  },
  mixins: [theme],
  data() {
    return {
      icons: {
        mdiCheckAll,
        mdiPencil,
        mdiPlus,
        mdiDelete,
        mdiPhoneDial,
      },
      image: undefined,
      user: {
        name: '',
        email: '',
      },
      currentAddress: undefined,
      showAddressDialog: false,
      phoneMenu: false,
      currentPhoneNumber: '',
      currentPhoneDescription: '',
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
      return this[field] ? mdiEyeOff : mdiEye
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
    editAddress(address) {
      this.currentAddress = address
      this.showAddressDialog = true
    },
    addNew() {
      this.currentAddress = undefined
      this.showAddressDialog = true
    },
    addAddress(address) {
      this.$apollo
        .mutate({
          mutation: CreateAddress,
          errorPolicy: 'all',
          variables: {
            address,
          },
        })
        .then(({ data, errors }) => {
          if (errors && errors.length) {
            errors.forEach((error) => {
              this.$toast.error(error.message, {
                duration: 10000,
              })
            })
            return
          }
          this.user.addresses.push(data.CreateAddress)
          this.showAddressDialog = false
          this.currentAddress = undefined
        })
    },
    updateAddress(address) {
      this.$apollo
        .mutate({
          mutation: UpdateAddress,
          errorPolicy: 'all',
          variables: {
            address: {
              id: address.id,
              street: address.street,
              number: address.number,
              city: address.city,
              country: address.country,
              district: address.district,
              state: address.state,
              zipCode: address.zipCode,
            },
          },
        })
        .then(({ errors, data }) => {
          if (errors && errors.length) {
            errors.forEach((error) => {
              this.$toast.error(error.message, {
                duration: 10000,
              })
            })
            return
          }
          this.user.addresses = [
            ...this.user.addresses.filter((item) => item.id !== address.id),
            data.UpdateAddress,
          ]
          this.showAddressDialog = false
          this.currentAddress = undefined
        })
    },
    deleteAdddress(address) {
      this.$apollo
        .mutate({
          mutation: RemoveAddress,
          variables: {
            id: address.id,
          },
        })
        .then(() => {
          this.user.addresses = this.user.addresses.filter(
            (item) => item.id !== address.id
          )
        })
    },
    addPhone() {
      const phone = {
        number: this.currentPhoneNumber,
        description: this.currentPhoneDescription,
      }
      this.$apollo
        .mutate({
          mutation: CreatePhone,
          errorPolicy: 'all',
          variables: {
            phone,
          },
        })
        .then(({ data, errors }) => {
          if (errors && errors.length) {
            errors.forEach((error) => {
              this.$toast.error(error.message, {
                duration: 10000,
              })
            })
            return
          }
          this.user.phones.push(data.CreatePhone)
          this.phoneMenu = false
          this.currentPhoneNumber = ''
          this.currentPhoneDescription = ''
        })
    },
    removePhone(phone) {
      this.$apollo
        .mutate({
          mutation: RemovePhone,
          variables: {
            id: phone.id,
          },
        })
        .then(() => {
          this.user.phones = this.user.phones.filter(
            (item) => item.id !== phone.id
          )
        })
    },
    previewImage() {
      const vue = this
      if (!this.image) return
      const fileReader = new FileReader()
      fileReader.readAsDataURL(this.image)
      fileReader.onloadend = function () {
        vue.user.image = fileReader.result
      }
    },
    updateImage() {
      const formData = new FormData()
      formData.append('image', this.image)
      this.$axios
        .post('/user/image', formData)
        .then(() => {
          this.$toast.show('Image updated', {
            duration: 1000,
          })
        })
        .catch(() => {
          this.$toast.error('Failed to upload image', {
            duration: 10000,
          })
        })
    },
  },
}
</script>

<style></style>
