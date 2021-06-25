<template>
  <v-app dark>
    <v-navigation-drawer clipped fixed :value="true" :mini-variant="false" app>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-img
              :src="`https://picsum.photos/800/600/?${Math.random()}`"
              :aspect-ratio="1"
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
    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import faker from 'faker'
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
