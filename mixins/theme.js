export default {
  computed: {
    isDark() {
      return this.$vuetify.theme.dark
    },
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    },
  },
}
