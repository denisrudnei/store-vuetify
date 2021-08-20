export const state = () => ({
  settings: {
    name: '',
    logo: '',
    isDark: true,
    darkPrimary: '#FFFFFF',
    darkSecondary: '#FFFFFF',
    darkAccent: '#FFFFFF',
    lightPrimary: '#FFFFFF',
    lightSecondary: '#FFFFFF',
    lightAccent: '#FFFFFF',
  },
  currency: 'USD',
  locale: '',
  adSense: false,
})

export const mutations = {
  setSiteSettings(state, settings) {
    state.settings = {
      ...settings,
      logo:
        settings.logo !== undefined && settings.logo !== ''
          ? settings.logo
          : state.settings.logo,
    }
  },
  updateSettingsAttribute(state, { name, value }) {
    state.settings[name] = value
  },
  updateName(state, name) {
    state.settings.name = name
  },
  updateThemeType(state, isDark) {
    state.settings.isDark = isDark
  },
  setLogo(state, logo) {
    state.settings = {
      ...state.settings,
      logo,
    }
  },
  setCurrency(state, currency) {
    state.currency = currency
  },
  setLocale(state, locale) {
    state.locale = locale
  },
  setAdSense(state, adSense) {
    state.adSense = adSense
  },
}

export const getters = {
  getSiteSettings(state) {
    return state.settings
  },
  getLogo(state) {
    return state.settings.logo
  },
  getCurrency(state) {
    return state.currency
  },
  getLocale(state) {
    return state.locale
  },
  getAdSense(state) {
    return state.adSense
  },
}
