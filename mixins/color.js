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
      cnpj,
      address,
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
      cnpj,
      address,
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
  methods: {
    updateColor(theme, type, value) {
      this.$store.commit('themes/updateColor', {
        theme,
        type,
        color: value,
      })
      this.$store.commit('site-settings/updateSettingsAttribute', {
        name: `${theme}${type.charAt(0).toUpperCase()}${type.slice(1)}`,
        value,
      })
      this.$vuetify.theme.themes[theme][type] = value
    },
    getColor() {
      return this.$store.getters['themes/getThemes'][this.theme][this.type]
    },
  },
}
