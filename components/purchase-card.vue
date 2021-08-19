<template>
  <v-card>
    <v-card-text>
      <v-row align="center" justify="center">
        <v-col md="1" cols="12" class="pa-5">
          <v-img
            v-if="purchase.products.length"
            :src="purchase.products[0].data.primaryImage"
            :aspect-ratio="1"
          />
        </v-col>
        <v-divider v-if="!isMobile" vertical />
        <v-col md="7" cols="12">
          <v-card v-if="purchase.products.length" flat>
            <v-card-title>
              {{ purchase.products[0].data.name }}
            </v-card-title>
            <v-card-text>
              <p v-html="purchase.products[0].data.ogDescription" />
              <v-divider />
              <p class="pt-2">{{ purchase.totalAmount }} items</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-divider v-if="!isMobile" vertical />
        <v-col md="2" cols="12">
          <v-row>
            <v-col cols="12">
              <v-btn
                block
                class="primary white--text"
                :to="`/profile/purchases/${purchase.id}`"
              >
                See purchase
              </v-btn>
            </v-col>
            <v-col cols="12">
              <v-btn
                block
                class="primary white--text"
                @click="buyAgain(purchase.id)"
              >
                Buy again
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
        <v-divider v-if="!isMobile" vertical />
        <v-col md="2" cols="12">
          <v-card flat>
            <v-card-title class="text-no-wrap">Quick actions</v-card-title>
            <v-card-text>
              <a href="#"> Quick action #1</a>
              <br />
              <a href="#">Quick action #2</a>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { GetProductsByIds } from '../graphql/query/product/GetProductsByIds'
import { GetPurchase } from '~/graphql/query/purchase/GetPurchase'
import theme from '~/mixins/theme'
export default {
  mixins: [theme],
  props: {
    purchase: {
      type: Object,
      default: () => ({
        id: 0,
        products: [],
      }),
    },
  },
  methods: {
    buyAgain(id) {
      this.$apollo
        .query({
          query: GetPurchase,
          variables: {
            id,
          },
        })
        .then((response) => {
          const ids = response.data.GetPurchase.products.map((product) => {
            return product.productId
          })
          this.$apollo
            .query({
              query: GetProductsByIds,
              variables: {
                ids,
              },
            })
            .then((response) => {
              response.data.GetProductsByIds.forEach((product) => {
                this.$store.commit('products/addToCart', product)
              })
              this.$router.push('/buy')
            })
        })
    },
  },
}
</script>

<style scoped>
a {
  text-decoration: none !important;
}
</style>
