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
        :append-icon="icons.mdiPalette"
        v-on="on"
      />
    </template>
    <v-color-picker
      v-model="color"
      mode="hexa"
      hide-mode-switch
      show-swatches
      @input="updateColor(theme, type, $event)"
    />
  </v-menu>
</template>

<script>
import { mdiPalette } from '@mdi/js'
import color from '~/mixins/color'
export default {
  mixins: [color],
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
    icons() {
      return {
        mdiPalette,
      }
    },
    color: {
      get() {
        return this.getColor()
      },
      set(_) {
        //
      },
    },
  },
}
</script>

<style></style>
