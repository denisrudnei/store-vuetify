<template>
  <v-card>
    <v-card-title>
      {{ products.length ? 'Products in cart' : 'No products' }}
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col v-if="products.length" cols="12">
          <v-list>
            <template v-for="product in products">
              <v-list-item :key="`list${product.id}`">
                <v-list-item-avatar>
                  <v-img :src="product.primaryImage" :aspect-ratio="16 / 9" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ product.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ product.price | dinero }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon class="red--text" @click="remove(product.id)">
                    <v-icon>{{ icons.mdiDelete }}</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
              <v-divider :key="`divider${product.id}`" />
            </template>
          </v-list>
        </v-col>
        <v-col v-if="products.length" cols="12">
          <cart-info />
        </v-col>
        <v-col cols="12">
          <v-btn
            to="/cart"
            block
            class="primary white--text"
            @click="cartMenu = false"
          >
            Go to cart
          </v-btn>
        </v-col>
        <v-col v-if="products.length" cols="12" @click="cartMenu = false">
          <v-btn to="/buy" block class="primary white--text">Buy</v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { mdiDelete } from '@mdi/js'
import cartInfo from './cartInfo.vue'
export default {
  components: { cartInfo },
  computed: {
    icons() {
      return {
        mdiDelete,
      }
    },
    cartMenu: {
      get() {
        return this.$store.getters['menus/getCartMenu']
      },
      set(value) {
        this.$store.commit('menus/setCartMenu', value)
      },
    },
    ...mapGetters({
      products: 'products/getCart',
    }),
  },
  methods: {
    remove(id) {
      this.$store.commit('products/remove', id)
    },
  },
}
</script>

<style></style>
