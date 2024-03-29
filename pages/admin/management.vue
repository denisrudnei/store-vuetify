<template>
  <v-card>
    <v-card-text>
      <v-row align="center">
        <v-col v-if="state === 'LOADING'" cols="12">
          <v-progress-linear color="primary" indeterminate />
        </v-col>
        <v-col v-if="state === 'ERROR'" cols="12">
          <v-alert color="error" outlined prominent> Failed to load</v-alert>
        </v-col>
        <v-col cols="12" md="auto">
          <v-btn class="primary white--text" @click="fixCategoriesSlug">
            <v-icon left>{{ icons.mdiTag }}</v-icon>
            Fix category slug
          </v-btn>
        </v-col>
        <v-col cols="12" md="auto">
          <v-switch
            v-model="adSense"
            label="Enable AdSense"
            @change="toggleAdSense"
          />
        </v-col>
        <v-col cols="12">
          <v-autocomplete
            label="Currency"
            outlined
            hide-details
            :items="currencies"
            :value="currency"
            :prepend-inner-icon="icons.mdiCurrencyUsd"
            @change="updateCurrency"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="username"
            label="Username"
            outlined
            hide-details
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            outlined
            hide-details
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-btn class="primary" @click="generateConfigFile">
            Generate config file
          </v-btn>
        </v-col>
        <v-col cols="12">
          <v-autocomplete
            label="Locale"
            outlined
            hide-details
            :items="locales"
            :value="locale"
            :prepend-inner-icon="icons.mdiTranslate"
            @change="updateLocale"
          />
        </v-col>
        <v-col>
          <v-file-input v-model="file" accept=".csv" />
          <v-btn
            class="primary white--text"
            :disabled="!file"
            @click="importProducts"
          >
            Import products from csv file
          </v-btn>
          <span>{{ imported }}</span>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { mdiTag, mdiCurrencyUsd, mdiTranslate } from '@mdi/js'
import { UpdateCurrency } from '../../graphql/mutation/admin/management/UpdateCurrency'
import { GetCurrency } from '../../graphql/query/admin/management/GetCurrency'
import { UpdateLocale } from '../../graphql/mutation/admin/management/UpdateLocale'
import { GetLocale } from '../../graphql/query/admin/management/GetLocale'
import { ToggleAdSense } from '../../graphql/mutation/site-settings/ToggleAdSense'
import { ProductImported } from '../../graphql/subscription/admin/management/ProductImported'
import values from './currencies.json'
import { FixCategoriesSlug } from '~/graphql/mutation/category/FixCategoriesSlug'
import { GetSiteSettings } from '~/graphql/query/site-settings/GetSiteSettings'
export default {
  data() {
    return {
      state: 'LOADED',
      currencies: [],
      locales: [],
      icons: {
        mdiTag,
        mdiCurrencyUsd,
        mdiTranslate,
      },
      username: '',
      password: '',
      file: null,
      imported: '',
    }
  },
  computed: {
    adSense: {
      set(value) {
        this.$store.commit('site-settings/setAdSense', value)
      },
      get() {
        return this.$store.getters['site-settings/getAdSense']
      },
    },
    ...mapGetters({
      currency: 'site-settings/getCurrency',
      locale: 'site-settings/getLocale',
    }),
  },
  created() {
    this.currencies = values.currency

    this.locales = Object.entries(values.locale).map((value) => ({
      text: value[1],
      value: value[0],
    }))

    this.$apollo
      .query({
        query: GetCurrency,
      })
      .then((response) => {
        this.$store.commit(
          'site-settings/setCurrency',
          response.data.GetCurrency.currency
        )
      })
  },
  mounted() {
    const productImportedSubscription = this.$apollo.subscribe({
      query: ProductImported,
    })
    const vue = this
    productImportedSubscription.subscribe({
      next({ data }) {
        vue.imported = data.ProductImported
      },
    })
  },
  methods: {
    fixCategoriesSlug() {
      this.state = 'LOADING'
      this.$apollo
        .mutate({
          mutation: FixCategoriesSlug,
        })
        .then(() => {
          this.$toast.show('Updated', {
            duration: 1000,
          })
          this.state = 'LOADED'
        })
        .catch(() => {
          this.state = 'ERROR'
        })
    },
    updateCurrency(value) {
      this.$apollo
        .mutate({
          mutation: UpdateCurrency,
          variables: {
            currency: value,
          },
          awaitRefetchQueries: true,
          refetchQueries: [{ query: GetSiteSettings }, { query: GetCurrency }],
        })
        .then(() => {
          this.$store.commit('site-settings/setCurrency', value)
          this.$toast.show('Currency updated', {
            duration: 1000,
          })
        })
    },
    updateLocale(value) {
      this.$apollo
        .mutate({
          mutation: UpdateLocale,
          variables: {
            locale: value,
          },
          awaitRefetchQueries: true,
          refetchQueries: [{ query: GetSiteSettings }, { query: GetLocale }],
        })
        .then(() => {
          this.$store.commit('site-settings/setLocale', value)
          this.$toast.show('Locale updated', {
            duration: 1000,
          })
        })
    },
    toggleAdSense(value) {
      this.$apollo
        .mutate({
          mutation: ToggleAdSense,
          variables: {
            status: value,
          },
        })
        .then(() => {
          this.$toast.show('Updated', {
            duration: 1000,
          })
        })
    },
    generateConfigFile() {
      this.$axios
        .post('/config/info', {
          username: this.username,
          password: this.password,
        })
        .then((response) => {
          const url = URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', 'info.json')
          document.body.appendChild(link)
          link.click()
        })
        .catch(() => {
          this.$toast.error('Failed to login')
        })
    },
    importProducts() {
      const formData = new FormData()
      formData.append('csv', this.file)
      this.$axios.post('/import/products', formData).then(() => {
        this.$toast.show('Uploaded', {
          duration: 1000,
        })
      })
    },
  },
}
</script>

<style></style>
