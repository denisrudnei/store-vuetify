import { GetSiteSettings } from '~/graphql/query/site-settings/GetSiteSettings'

export default {
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
        this.$vuetify.theme.themes.light = value
      },
    },
    dark: {
      get() {
        return this.$store.getters['themes/getDarkTheme']
      },
      set(value) {
        this.$store.commit('themes/updateTheme', { name: 'dark', theme: value })
        this.$vuetify.theme.themes.dark = value
      },
    },
  },
  async beforeCreate() {
    const { data } = await this.$apollo.query({
      query: GetSiteSettings,
    })

    const siteSettings = data.GetSiteSettings
    const {
      name,
      isDark,
      darkPrimary,
      darkSecondary,
      darkAccent,
      lightPrimary,
      lightSecondary,
      lightAccent,
    } = siteSettings

    this.$vuetify.theme.dark = isDark

    this.dark = {
      ...this.$vuetify.theme.themes.dark,
      primary: darkPrimary,
      secondary: darkSecondary,
      accent: darkAccent,
    }

    this.light = {
      ...this.$vuetify.theme.themes.light,
      primary: lightPrimary,
      secondary: lightSecondary,
      accent: lightAccent,
    }

    this.$store.commit('site-settings/setSiteSettings', {
      name,
      isDark,
      darkPrimary,
      darkSecondary,
      darkAccent,
      lightPrimary,
      lightSecondary,
      lightAccent,
    })

    if (this.$auth.loggedIn) {
      const user = this.$auth.user
      if (user.darkTheme !== undefined) {
        this.$vuetify.theme.dark = user.darkTheme
      }
    }
  },
  beforeUpdate() {
    if (localStorage.getItem('isDark') === 'false' && !this.$auth.loggedIn) {
      this.$vuetify.theme.dark = false
    }
  },
}
