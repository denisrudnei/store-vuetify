export const state = () => ({
  dark: {
    primary: '#FFFFFF',
    secondary: '#FFFFFF',
    accent: '#FFFFFF',
  },
  light: {
    primary: '#FFFFFF',
    secondary: '#FFFFFF',
    accent: '#FFFFFF',
  },
  isDark: true,
})

export const mutations = {
  updateColor(state, { theme, type, color }) {
    state[theme][type] = color
  },
  updateTheme(state, { name, theme }) {
    state[name] = theme
  },
}

export const getters = {
  getDarkTheme(state) {
    return state.dark
  },
  getLightTheme(state) {
    return state.light
  },
  getThemes(state) {
    return state
  },
}
