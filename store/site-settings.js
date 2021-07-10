export const state = () => ({
  settings: {
    name: '',
    isDark: true,
    darkPrimary: '#FFFFFF',
    darkSecondary: '#FFFFFF',
    darkAccent: '#FFFFFF',
    lightPrimary: '#FFFFFF',
    lightSecondary: '#FFFFFF',
    lightAccent: '#FFFFFF',
  },
})

export const mutations = {
  setSiteSettings(state, settings) {
    state.settings = settings
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
}

export const getters = {
  getSiteSettings(state) {
    return state.settings
  },
}
