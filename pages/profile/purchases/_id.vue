<template>
  <v-row>
    <v-col cols="12" md="8">
      <v-card
        v-for="product in purchase.products"
        :key="product.data.id"
        :flat="isDark"
        class="mb-3"
      >
        <v-card-title>
          <p>Product {{ product.data.name }}</p>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-row>
            <v-col cols="12" md="11">
              <p>Amount: {{ product.data.amount }}</p>
              <p>Item price: {{ product.data.price | dinero }}</p>
            </v-col>
            <v-divider vertical />
            <v-col cols="12" md="1">
              <v-menu open-on-hover max-width="250">
                <template #activator="{ on }">
                  <v-img
                    :src="product.data.primaryImage"
                    :aspect-ratio="1"
                    contain
                    v-on="on"
                  />
                </template>
                <v-card>
                  <v-img
                    :src="product.data.primaryImage"
                    :aspect-ratio="1"
                    width="250"
                    contain
                  />
                </v-card>
              </v-menu>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-divider vertical></v-divider>
    <v-col cols="12" md="4">
      <v-card :flat="isDark">
        <v-card-title> Details of purchase </v-card-title>
        <v-card-text>
          <v-row>
            <v-col v-if="purchase.createdAt" cols="12">
              Date {{ purchase.createdAt | dateAndHour }}
            </v-col>
            <v-col cols="12">
              <v-divider class="mb-3" />
              <span> Payment: {{ purchase.totalPrice | dinero }}</span>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { GetPurchase } from '../../../graphql/query/purchase/GetPurchase'
import theme from '~/mixins/theme'
export default {
  mixins: [theme],
  data() {
    return {
      purchase: {
        totalPrice: 0,
      },
    }
  },
  head() {
    return {
      title: 'Purchase',
    }
  },
  created() {
    this.$apollo
      .query({
        query: GetPurchase,
        variables: {
          id: this.$route.params.id,
        },
      })
      .then((response) => {
        this.purchase = response.data.GetPurchase
      })
  },
}
</script>

<style></style>
