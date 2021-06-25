<template>
  <v-app dark>
    <v-navigation-drawer clipped fixed :value="true" :mini-variant="false" app>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-row align="align-center">
              <v-col cols="12">
                <v-avatar :size="185">
                  <v-img
                    :src="`https://picsum.photos/800/600/?${Math.random()}`"
                  />
                </v-avatar>
              </v-col>
            </v-row>
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
      <v-badge overlap left inline>
        <v-btn icon to="/cart">
          <v-icon>mdi-cart</v-icon>
        </v-btn>
        <template #badge>
          {{ products.length }}
        </template>
      </v-badge>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipped: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Home',
          to: '/',
        },
        {
          icon: 'mdi-label',
          title: 'Diversos',
          to: '/categories/Diversos/',
        },
        {
          icon: 'mdi-label',
          title: 'Diversos 2',
          to: '/categories/Diversos 2',
        },
      ],
      title: 'Store',
    }
  },
  computed: {
    products: {
      get() {
        return this.$store.getters['products/getCart']
      },
    },
  },
}
</script>
