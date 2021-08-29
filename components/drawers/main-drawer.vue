<template>
  <v-navigation-drawer v-model="drawer" clipped fixed :mini-variant="mini" app>
    <v-list>
      <v-list-item>
        <v-list-item-content>
          <v-img :src="logo" :aspect-ratio="1" class="rounded-circle" />
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :to="item.to"
        router
        exact
      >
        <v-list-item-action>
          <v-icon color="primary">{{ item.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content
          :class="{ 'primary--text': !$vuetify.theme.isDark }"
        >
          <v-list-item-title v-text="item.title" />
        </v-list-item-content>
      </v-list-item>
      <v-list-item to="/all-categories" router exact>
        <v-list-item-action>
          <v-icon color="primary">{{ icons.mdiExpandAll }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title
            :class="{ 'primary--text': !$vuetify.theme.isDark }"
          >
            All categories
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item to="/products" router exact>
        <v-list-item-action>
          <v-icon color="primary">{{ icons.mdiTagMultiple }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title
            :class="{ 'primary--text': !$vuetify.theme.isDark }"
          >
            All products
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider />
      <v-list-item
        v-for="item in categoriesItems"
        :key="item.title"
        :to="item.to"
        router
        exact
      >
        <v-list-item-action>
          <v-icon color="primary">{{ item.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content
          :class="{ 'primary--text': !$vuetify.theme.isDark }"
        >
          <v-list-item-title v-text="item.title" />
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <adsbygoogle v-if="adSense" />
  </v-navigation-drawer>
</template>

<script>
import { mdiApps, mdiTagMultiple, mdiExpandAll, mdiLabel } from '@mdi/js'
import { mapGetters } from 'vuex'
import theme from '~/mixins/theme'
export default {
  mixins: [theme],
  data() {
    return {
      icons: {
        mdiExpandAll,
        mdiTagMultiple,
        mdiApps,
        mdiLabel,
      },
      items: [
        {
          icon: mdiApps,
          title: 'Home',
          to: '/',
        },
      ],
    }
  },
  computed: {
    ...mapGetters({
      logo: 'site-settings/getLogo',
      adSense: 'site-settings/getAdSense',
      mini: 'menus/getMainMiniVariant',
    }),
    drawer: {
      get() {
        return this.$store.getters['menus/getMainDrawer']
      },
      set(value) {
        this.$store.commit('menus/setMainDrawer', value)
      },
    },
    logged() {
      return this.$auth.loggedIn
    },
    isAdmin() {
      return this.logged && this.$auth.user.role === 'ADMIN'
    },
    categories() {
      return this.$store.getters['category/getCategories']
    },
    categoriesItems() {
      return this.categories.map((category) => ({
        icon: mdiLabel,
        title: `${category.name}`,
        to: `/categories/${category.slug}`,
      }))
    },
  },
}
</script>

<style></style>
