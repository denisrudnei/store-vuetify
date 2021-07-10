<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-text>
          <v-text-field
            :value="settings.name"
            outlined
            label="Name"
            @change="updateName"
          />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="8">
      <v-card>
        <v-card-title> Themes </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-tabs v-model="tab">
                <v-tab>Light</v-tab>
                <v-tab>Dark</v-tab>
              </v-tabs>
            </v-col>
            <v-col cols="12">
              <v-tabs-items v-model="tab" class="pt-3">
                <v-tab-item>
                  <color-select theme="light" type="primary" label="Primary" />
                  <color-select
                    theme="light"
                    type="secondary"
                    label="Secondary"
                  />
                  <color-select theme="light" type="accent" label="Accent" />
                </v-tab-item>
                <v-tab-item>
                  <color-select theme="dark" type="primary" label="Primary" />
                  <color-select
                    theme="dark"
                    type="secondary"
                    label="Secondary"
                  />
                  <color-select theme="dark" type="accent" label="Accent" />
                </v-tab-item>
              </v-tabs-items>
            </v-col>
            <v-col cols="12">
              <v-checkbox
                label="Dark as default?"
                :input-value="settings.isDark"
                @change="updateThemeType"
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn class="primary white--text" @click="save">
            Save
            <v-icon right>mdi-check-all</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card :dark="$vuetify.theme.dark">
        <v-img
          :src="`https://picsum.photos/800/600/?${Math.random()}`"
          :aspect-ratio="16 / 9"
        />
        <v-card-text>
          <span class="primary--text title">Primary</span>
          <v-divider />
          <span class="secondary--text title">Secondary color</span>
          <v-divider />
          <span class="accent--text title">Accent color</span>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import faker from 'faker'
import colorSelect from '~/components/color-select.vue'
import { EditSiteSettings } from '~/graphql/mutation/site-settings/EditSiteSettings'
export default {
  components: { colorSelect },
  data() {
    return {
      tab: undefined,
      description: faker.lorem.sentence(),
    }
  },
  head: {
    title: 'Customization',
  },
  computed: {
    darkTheme: {
      get() {
        return this.settings.isDark
      },
      set(value) {
        this.$vuetify.theme.dark = value
      },
    },
    settings: {
      get() {
        return this.$store.getters['site-settings/getSiteSettings']
      },
      set(value) {
        this.$store.commit('site-settings/setSiteSettings', value)
      },
    },
    light: {
      get() {
        return this.$store.getters['themes/getLightTheme']
      },
      set(value) {
        this.$store.commit('themes/updateTheme', {
          name: 'light',
          theme: value,
        })
      },
    },
    dark: {
      get() {
        return this.$store.getters['themes/getDarkTheme']
      },
      set(value) {
        this.$store.commit('themes/updateTheme', { name: 'dark', theme: value })
      },
    },
  },
  watch: {
    tab(value) {
      this.$vuetify.theme.dark = value === 1
    },
  },
  mounted() {
    this.tab = this.darkTheme ? 1 : 0
  },
  methods: {
    save() {
      this.$apollo
        .mutate({
          mutation: EditSiteSettings,
          variables: {
            settings: this.settings,
          },
        })
        .then(() => {
          this.$toast.show('Updated', {
            duration: 1000,
          })
        })
    },
    updateName(name) {
      this.$store.commit('site-settings/updateName', name)
    },
    updateThemeType(isDark) {
      this.$store.commit('site-settings/updateThemeType', isDark)
    },
  },
}
</script>

<style></style>
