<template>
  <v-card>
    <v-card-text>
      <v-row align="center" justify="center">
        <v-col md="1" cols="12" class="pa-5">
          <v-img
            :src="`https://picsum.photos/800/800/?${Math.random()}`"
            :aspect-ratio="1"
          />
        </v-col>
        <v-divider v-if="!isMobile" vertical />
        <v-col md="7" cols="12">
          <v-card flat>
            <v-card-title>
              {{ productName }}
            </v-card-title>
            <v-card-text>
              <p>{{ description }}</p>
              <v-divider />
              <p class="pt-2">{{ Math.round(Math.random() * 15) }} UN</p>
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
              <v-btn block class="primary white--text" to="/buy">
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
import faker from 'faker'
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
  data() {
    return {
      productName: faker.commerce.productName(),
      description: faker.lorem.sentence(),
    }
  },
}
</script>

<style scoped>
a {
  text-decoration: none !important;
}
</style>
