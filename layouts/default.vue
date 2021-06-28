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
            <v-img
              :src="`https://picsum.photos/800/600/?${Math.random()}`"
              :aspect-ratio="1"
              class="rounded-circle"
            />
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
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar clipped-left fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <notification-list />
      <v-menu
        v-model="cartMenu"
        nudge-width="450"
        :close-on-content-click="false"
      >
        <template #activator="{ on }">
          <v-btn icon class="acdent primary--text" v-on="on">
            <v-badge left bottom overlap bordered color="accent">
              <v-icon>mdi-cart</v-icon>
              <template #badge>
                {{ products.length }}
              </template>
            </v-badge>
          </v-btn>
        </template>
        <cart-menu />
        <v-card v-if="$vuetify.breakpoint.mobile">
          <v-card-text>
            <v-btn class="primary white--text" block @click="cartMenu = false">
              Close
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import faker from 'faker'
import cartMenu from '~/components/cartMenu.vue'
import NotificationList from '~/components/notification-list.vue'
export default {
  components: { cartMenu, NotificationList },
  data() {
    return {
      clipped: false,
      drawer: true,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Home',
          to: '/',
        },
      ],
      title: 'Store',
    }
  },
  computed: {
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
  },
  created() {
    this.$store.commit(
      'category/setCategories',
      Array.from({ length: 5 }, (_, x) => (x += 1)).map((item) => ({
        id: item,
        name: faker.commerce.department(),
      }))
    )
    this.items = [
      ...this.items,
      ...this.categories.map((category) => ({
        icon: 'mdi-label',
        title: `${category.name}`,
        to: `/categories/${category.name}`,
      })),
    ]
  },
}
</script>
