<template>
  <v-app dark>
    <main-drawer />
    <client-only>
      <admin-drawer v-if="isAdmin" />
    </client-only>
    <v-app-bar clipped-left clipped-right fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-items v-if="drawer">
        <v-btn icon @click="mainMini = !mainMini">
          <v-icon>
            {{ mainMini ? icons.mdiChevronRight : icons.mdiChevronLeft }}
          </v-icon>
        </v-btn>
      </v-toolbar-items>
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
            to="/admin/dashboard"
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
import {
  mdiWhiteBalanceSunny,
  mdiWeatherNight,
  mdiAccount,
  mdiCart,
  mdiFacebook,
  mdiYoutube,
  mdiTwitter,
  mdiDiscord,
  mdiClose,
  mdiCog,
  mdiExitToApp,
  mdiChevronRight,
  mdiChevronLeft,
} from '@mdi/js'
import ColorMiddleware from '../middleware/ColorMiddleware'
import { GetDefaultInfo } from '../graphql/query/GetDefaultInto'
import { PurchaseStatusUpdated } from '../graphql/subscription/purchase/PurchaseStatusUpdated'
import cartMenu from '~/components/cartMenu'
import NotificationList from '~/components/notification-list'
import mainDrawer from '~/components/drawers/main-drawer'
import adminDrawer from '~/components/drawers/admin-drawer'
import theme from '~/mixins/theme'
import color from '~/mixins/color'
import { UpdateTheme } from '~/graphql/mutation/user/UpdateTheme'
import { NewPurchase } from '~/graphql/subscription/purchase/NewPurchase'
export default {
  components: { cartMenu, NotificationList, mainDrawer, adminDrawer },
  mixins: [theme, color],
  middleware: [ColorMiddleware],
  data() {
    return {
      clipped: false,
      socialNetworks: [],
      icons: {
        mdiWhiteBalanceSunny,
        mdiWeatherNight,
        mdiAccount,
        mdiCart,
        mdiFacebook,
        mdiYoutube,
        mdiTwitter,
        mdiDiscord,
        mdiClose,
        mdiCog,
        mdiExitToApp,
        mdiChevronRight,
        mdiChevronLeft,
      },
      title: 'Store',
    }
  },
  computed: {
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
    mainMini: {
      get() {
        return this.$store.getters['menus/getMainMiniVariant']
      },
      set(value) {
        this.$store.commit('menus/setMainMiniVariant', value)
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
          'site-settings/setCurrency',
          response.data.GetSiteSettings.currency
        )

        this.$store.commit(
          'site-settings/setLocale',
          response.data.GetSiteSettings.locale
        )

        this.$store.commit(
          'site-settings/setAdSense',
          response.data.GetSiteSettings.adSense
        )

        this.$store.commit(
          'category/setCategories',
          response.data.GetCategories
        )
        Object.entries(response.data.GetSocialNetworks).forEach((entry) => {
          const [name, value] = entry
          if (name !== 'id' && value && value.length) {
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
    if (this.isAdmin) {
      this.$store.commit('menus/setAdminDrawer', true)
    }
  },
  mounted() {
    if (this.isAdmin) {
      const vue = this
      const newPurchaseSubscription = this.$apollo.subscribe({
        query: NewPurchase,
      })
      newPurchaseSubscription.subscribe({
        next({ data }) {
          if (data.NewPurchase.type === 'DELIVERY') {
            vue.$store.commit('purchase/addDelivery', data.NewPurchase)
          }
        },
      })
      const purchaseStatusUpdated = this.$apollo.subscribe({
        query: PurchaseStatusUpdated,
      })
      purchaseStatusUpdated.subscribe({
        next({ data }) {
          vue.$store.commit(
            'purchase/updatePurchase',
            data.PurchaseStatusUpdated
          )
        },
      })
    }
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
