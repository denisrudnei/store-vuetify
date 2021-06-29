<template>
  <v-row>
    <v-col cols="12">
      <v-text-field outlined label="Name" />
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
          </v-row>
        </v-card-text>
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
export default {
  components: { colorSelect },
  data() {
    return {
      tab: 0,
      description: faker.lorem.sentence(),
    }
  },
  computed: {
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
    darkTheme(value) {
      this.$vuetify.theme.dark = value
    },
  },
  created() {
    this.darkTheme = this.$vuetify.theme.dark
    this.tab = this.darkTheme ? 1 : 0
    this.dark = this.$vuetify.theme.themes.dark
    this.light = this.$vuetify.theme.themes.light
  },
}
</script>

<style></style>
