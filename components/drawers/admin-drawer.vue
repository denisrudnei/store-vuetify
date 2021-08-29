<template>
  <v-navigation-drawer
    v-model="drawer"
    right
    :mini-variant="mini"
    app
    clipped
    fixed
  >
    <v-list>
      <v-list-item @click="mini = !mini">
        <v-list-item-action>
          <v-icon>
            {{ mini ? icons.mdiChevronLeft : icons.mdiChevronRight }}
          </v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title> Hide </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item to="/admin/purchase/delivery">
        <v-list-item-action>
          <v-btn icon>
            <v-badge bottom overlap bordered left>
              <template #badge> <span>0</span> </template>
              <v-icon>
                {{ icons.mdiTruck }}
              </v-icon>
            </v-badge>
          </v-btn>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title> Delivery </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mdiTruck, mdiChevronLeft, mdiChevronRight } from '@mdi/js'
export default {
  data() {
    return {
      icons: {
        mdiTruck,
        mdiChevronLeft,
        mdiChevronRight,
      },
    }
  },
  computed: {
    drawer: {
      get() {
        return this.$store.getters['menus/getAdminDrawer']
      },
      set(value) {
        this.$store.commit('menus/setAdminDrawer', value)
      },
    },
    mini: {
      get() {
        return this.$store.getters['menus/getAdminMiniVariant']
      },
      set(value) {
        this.$store.commit('menus/setAdminMiniVariant', value)
      },
    },
  },
}
</script>

<style></style>
