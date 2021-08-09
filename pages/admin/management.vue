<template>
  <v-card>
    <v-card-text>
      <v-row align="center" justify="center">
        <v-col v-if="state === 'LOADING'" cols="12">
          <v-progress-linear color="primary" indeterminate />
        </v-col>
        <v-col v-if="state === 'ERROR'" cols="12">
          <v-alert color="error" outlined prominent> Failed to load</v-alert>
        </v-col>
        <v-col cols="12">
          <v-btn class="primary white--text" @click="fixCategoriesSlug">
            <v-icon left>{{ icons.mdiTag }}</v-icon>
            Fix category slug
          </v-btn>
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
    }
  },
  computed: mapGetters({
    currency: 'site-settings/getCurrency',
    locale: 'site-settings/getLocale',
  }),
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
  },
}
</script>

<style></style>
