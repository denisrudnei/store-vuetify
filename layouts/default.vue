<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      clipped
      fixed
      :mini-variant="false"
      app
    >
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
      <adsbygoogle />
    </v-navigation-drawer>
    <v-app-bar clipped-left clipped-right fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-tooltip left>
        <template #activator="{ on }">
          <v-btn
            icon
            :class="{
              'white--text': isDark,
              'primary--text': !isDark,
            }"
            v-on="on"
            @click="toggleTheme"
          >
            <v-icon>
              {{ isDark ? icons.mdiWhiteBalanceSunny : icons.mdiWeatherNight }}
            </v-icon>
          </v-btn>
        </template>
        <span>Change theme</span>
      </v-tooltip>
      <v-btn
        icon
        :class="{ 'white--text': isDark, 'primary--text': !isDark }"
        to="/profile"
      >
        <v-icon>{{ icons.mdiAccount }}</v-icon>
      </v-btn>
      <client-only>
        <notification-list v-if="logged" />
      </client-only>
      <v-menu
        v-model="cartMenu"
        nudge-width="450"
        :close-on-content-click="false"
      >
        <template #activator="{ on }">
          <v-btn icon class="primary--text" v-on="on">
            <v-badge left bottom overlap bordered color="accent">
              <v-icon>{{ icons.mdiCart }}</v-icon>
              <template #badge>
                {{ products.length }}
              </template>
            </v-badge>
          </v-btn>
        </template>
        <cart-menu />
        <v-card v-if="isMobile">
          <v-card-text>
            <v-btn class="primary white--text" block @click="cartMenu = false">
              Close
              <v-icon>{{ icons.mdiClose }}</v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-menu>
      <client-only>
        <template v-if="isAdmin">
          <v-btn
            :class="{
              'white--text': isDark,
              'primary--text': !isDark,
            }"
            icon
            to="/admin"
          >
            <v-icon>{{ icons.mdiCog }}</v-icon>
          </v-btn>
        </template>
      </client-only>
      <v-btn v-show="logged" icon @click="logout">
        <v-icon>{{ icons.mdiExitToApp }}</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
      <dialog-box />
      <v-footer :dark="isDark" padless class="text-center">
        <v-card flat tile width="100%">
          <v-card-text>
            <v-btn
              v-for="network in socialNetworks"
              :key="network.name"
              icon
              :href="network.url"
              target="_blank"
            >
              <v-icon>{{ network.icon }}</v-icon>
            </v-btn>
            <v-spacer />
            <span>&copy; {{ new Date().getFullYear() }}</span>
          </v-card-text>
        </v-card>
      </v-footer>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  mdiApps,
  mdiWhiteBalanceSunny,
  mdiWeatherNight,
  mdiAccount,
  mdiCart,
  mdiTagMultiple,
  mdiExpandAll,
  mdiLabel,
  mdiFacebook,
  mdiYoutube,
  mdiTwitter,
  mdiDiscord,
  mdiClose,
  mdiCog,
  mdiExitToApp,
} from '@mdi/js'
import ColorMiddleware from '../middleware/ColorMiddleware'
import { UpdateTheme } from '../graphql/mutation/user/UpdateTheme'
import { GetDefaultInfo } from '../graphql/query/GetDefaultInto'
import cartMenu from '~/components/cartMenu.vue'
import DialogBox from '~/components/dialog-box.vue'
import NotificationList from '~/components/notification-list.vue'
import theme from '~/mixins/theme'
import color from '~/mixins/color'
export default {
  components: { cartMenu, NotificationList, DialogBox },
  mixins: [theme, color],
  middleware: [ColorMiddleware],
  data() {
    return {
      clipped: false,
      socialNetworks: [],
      icons: {
        mdiApps,
        mdiWhiteBalanceSunny,
        mdiWeatherNight,
        mdiAccount,
        mdiCart,
        mdiTagMultiple,
        mdiExpandAll,
        mdiFacebook,
        mdiYoutube,
        mdiTwitter,
        mdiDiscord,
        mdiClose,
        mdiCog,
        mdiExitToApp,
      },
      items: [
        {
          icon: mdiApps,
          title: 'Home',
          to: '/',
        },
      ],
      title: 'Store',
    }
  },
  computed: {
    ...mapGetters({
      logo: 'site-settings/getLogo',
    }),
    logged() {
      return this.$auth.loggedIn
    },
    isAdmin() {
      return this.logged && this.$auth.user.role === 'ADMIN'
    },
    drawer: {
      get() {
        return this.$store.getters['menus/getMainDrawer']
      },
      set(value) {
        this.$store.commit('menus/setMainDrawer', value)
      },
    },
    cartMenu: {
      get() {
        return this.$store.getters['menus/getCartMenu']
      },
      set(value) {
        this.$store.commit('menus/setCartMenu', value)
      },
    },
    products: {
      get() {
        return this.$store.getters['products/getCart']
      },
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
  created() {
    this.$apollo
      .query({
        query: GetDefaultInfo,
      })
      .then((response) => {
        this.$store.commit(
          'site-settings/setLogo',
          response.data.GetSiteSettings.logo
        )

        this.$store.commit(
          'category/setCategories',
          response.data.GetCategories
        )
        Object.entries(response.data.GetSocialNetworks).forEach((entry) => {
          const [name, value] = entry
          if (name !== 'id' && value.length) {
            this.socialNetworks.push({
              name,
              icon: this.icons[
                `mdi${name.charAt(0).toUpperCase()}${name.slice(1)}`
              ],
              url: value,
            })
          }
        })
      })
  },
  methods: {
    toggleTheme() {
      this.isDark = !this.$vuetify.theme.isDark
      if (this.logged) {
        this.$apollo
          .mutate({
            mutation: UpdateTheme,
            variables: {
              isDark: this.isDark,
            },
          })
          .then(() => {
            this.$auth.fetchUser()
          })
      }
      localStorage.setItem('isDark', this.isDark)
    },
    logout() {
      this.$dialog('Logout?')
        .then(() => {
          this.$auth.logout()
        })
        .catch(() => {
          this.$toast.show('Canceled', {
            duration: 1000,
          })
        })
    },
  },
}
</script>
<style scoped>
.v-application {
  background-color: var(--v-background-base);
}
</style>
