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
            <v-col v-for="color in palette" :key="color" cols="12" md="4">
              <v-card elevation="0">
                <v-card-title>
                  <span>{{ color }}</span>
                </v-card-title>
                <v-divider />
                <v-card-text>
                  <v-menu :close-on-content-click="false" nudge-width="250">
                    <template #activator="{ on }">
                      <v-sheet :color="color" shaped height="100" v-on="on" />
                    </template>
                    <v-card>
                      <v-card-title> Update theme </v-card-title>
                      <v-card-text>
                        <v-tabs v-model="tab" grow>
                          <v-tab>Light</v-tab>
                          <v-tab>Dark</v-tab>
                          <v-tab-item>
                            <v-list>
                              <v-list-item
                                @click="updateColor('light', 'primary', color)"
                              >
                                <v-list-item-action>
                                  <v-icon>mdi-palette</v-icon>
                                </v-list-item-action>
                                <v-list-item-content>
                                  Set as primary
                                </v-list-item-content>
                              </v-list-item>
                              <v-list-item
                                @click="
                                  updateColor('light', 'secondary', color)
                                "
                              >
                                <v-list-item-action>
                                  <v-icon>mdi-palette</v-icon>
                                </v-list-item-action>
                                <v-list-item-content>
                                  Set as secondary
                                </v-list-item-content>
                              </v-list-item>
                              <v-list-item
                                @click="updateColor('light', 'accent', color)"
                              >
                                <v-list-item-action>
                                  <v-icon>mdi-palette</v-icon>
                                </v-list-item-action>
                                <v-list-item-content>
                                  Set as accent
                                </v-list-item-content>
                              </v-list-item>
                            </v-list>
                          </v-tab-item>
                          <v-tab-item>
                            <v-list>
                              <v-list-item
                                @click="updateColor('dark', 'primary', color)"
                              >
                                <v-list-item-action>
                                  <v-icon>mdi-palette</v-icon>
                                </v-list-item-action>
                                <v-list-item-content>
                                  Set as primary
                                </v-list-item-content>
                              </v-list-item>
                              <v-list-item
                                @click="updateColor('dark', 'secondary', color)"
                              >
                                <v-list-item-action>
                                  <v-icon>mdi-palette</v-icon>
                                </v-list-item-action>
                                <v-list-item-content>
                                  Set as secondary
                                </v-list-item-content>
                              </v-list-item>
                              <v-list-item
                                @click="updateColor('dark', 'accent', color)"
                              >
                                <v-list-item-action>
                                  <v-icon>mdi-palette</v-icon>
                                </v-list-item-action>
                                <v-list-item-content>
                                  Set as accent
                                </v-list-item-content>
                              </v-list-item>
                            </v-list>
                          </v-tab-item>
                        </v-tabs>
                      </v-card-text>
                    </v-card>
                  </v-menu>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
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
        <img id="img" :src="logo" style="width: 100%" />
        <v-card-text>
          <span class="primary--text title">Primary</span>
          <v-divider />
          <span class="secondary--text title">Secondary color</span>
          <v-divider />
          <span class="accent--text title">Accent color</span>
        </v-card-text>
        <v-card-actions>
          <v-row>
            <v-col cols="12">
              <v-file-input
                v-model="image"
                outlined
                label="Select logo"
                @change="previewImage"
              />
            </v-col>
            <v-col cols="12">
              <v-btn
                class="primary white--text"
                block
                :disabled="!image"
                @click="saveImage"
              >
                Update image
                <v-icon right>mdi-content-save</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="12">
              <v-btn
                class="primary white--text"
                block
                :disabled="!image"
                @click="getPalette"
              >
                Get palette
                <v-icon> mdi-palette </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import faker from 'faker'
import ColorThief from 'colorthief'
import colorSelect from '~/components/color-select.vue'
import { EditSiteSettings } from '~/graphql/mutation/site-settings/EditSiteSettings'
import { GetSiteSettings } from '~/graphql/query/site-settings/GetSiteSettings'
import color from '~/mixins/color'
export default {
  components: { colorSelect },
  mixins: [color],
  data() {
    return {
      logo: '',
      palette: [],
      image: undefined,
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
  created() {
    this.$apollo
      .query({
        query: GetSiteSettings,
      })
      .then((response) => {
        this.logo = response.data.GetSiteSettings.logo
      })
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
    saveImage() {
      if (this.image) {
        const formData = new FormData()
        formData.append('image', this.image)
        this.$axios
          .post('/site-settings/image', formData)
          .then((response) => {
            this.$toast.show('Saved', {
              duration: 5000,
            })

            this.$store.commit(
              'site-settings/setLogo',
              `${response.data.location}?${new Date()}`
            )
          })
          .catch(() => {
            this.$toast.error('Failed to upload image', {
              duration: 10000,
            })
          })
      }
    },
    updateName(name) {
      this.$store.commit('site-settings/updateName', name)
    },
    updateThemeType(isDark) {
      this.$store.commit('site-settings/updateThemeType', isDark)
    },
    previewImage() {
      const vue = this
      if (this.image) {
        const fileReader = new FileReader()
        fileReader.readAsDataURL(this.image)
        fileReader.onloadend = () => {
          vue.logo = fileReader.result
        }
      }
    },
    getPalette() {
      const rgbToHex = (r, g, b) =>
        '#' +
        [r, g, b]
          .map((x) => {
            const hex = x.toString(16)
            return hex.length === 1 ? '0' + hex : hex
          })
          .join('')
      const colorThief = new ColorThief()

      this.palette = colorThief
        .getPalette(document.querySelector('#img'), 6)
        .map((color) => rgbToHex(...color))
    },
  },
}
</script>

<style></style>
