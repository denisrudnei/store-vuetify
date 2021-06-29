<template>
  <v-menu :close-on-content-click="false" min-width="auto">
    <template #activator="{ on }">
      <v-text-field
        filled
        :label="label"
        :value="getColor()"
        readonly
        dark
        :background-color="getColor()"
        append-icon="mdi-palette"
        v-on="on"
      />
    </template>
    <v-color-picker
      v-model="color"
      mode="hexa"
      hide-canvas
      hide-mode-switch
      show-swatches
      @input="updateColor(theme, type, $event)"
    />
  </v-menu>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default() {
        return ''
      },
    },
    theme: {
      type: String,
      default() {
        return ''
      },
    },
    type: {
      type: String,
      default() {
        return ''
      },
    },
  },
  computed: {
    color: {
      get() {
        return this.getColor()
      },
    },
  },
  methods: {
    updateColor(theme, type, value) {
      this.$store.commit('themes/updateColor', {
        theme,
        type,
        color: value,
      })
      this.$vuetify.theme.themes[theme][type] = value
    },
    getColor() {
      return this.$store.getters['themes/getThemes'][this.theme][this.type]
    },
  },
}
</script>

<style></style>
