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
          <v-row>
            <v-col cols="12" md="11">
              {{ product.data.name }}
            </v-col>
            <v-divider vertical />
            <v-col cols="12" md="1">
              <v-img src="https://picsum.photos/800/800" :aspect-ratio="1" />
            </v-col>
          </v-row>
        </v-card-title>
      </v-card>
    </v-col>
    <v-divider vertical></v-divider>
    <v-col cols="12" md="4">
      <v-card :flat="isDark">
        <v-card-title> Details of purchase </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">Date {{ purchase.createdAt }}</v-col>
            <v-col cols="12">
              <v-divider class="mb-3" />
              <span> Payment: $ {{ price }}</span>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import faker from 'faker'
import { GetPurchase } from '../../../graphql/query/purchase/GetPurchase'
import theme from '~/mixins/theme'
export default {
  mixins: [theme],
  data() {
    return {
      productName: faker.commerce.productName(),
      price: faker.commerce.price(),
      purchase: {},
    }
  },
  head() {
    return {
      title: `Purchase - ${this.productName}`,
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
