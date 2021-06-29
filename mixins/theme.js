export default {
  computed: {
    isDark: {
      get() {
        return this.$vuetify.theme.dark
      },
      set(value) {
        this.$vuetify.theme.dark = value
      },
    },
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    },
  },
}
