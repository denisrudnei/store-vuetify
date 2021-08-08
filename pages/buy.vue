<template>
  <v-row>
    <v-col cols="12">
      <v-stepper v-model="step">
        <v-stepper-header>
          <v-stepper-step :complete="step > 1" step="1">
            Client information
          </v-stepper-step>
          <v-divider />
          <v-stepper-step :complete="step > 2" step="2">
            Review products
          </v-stepper-step>
          <v-divider />
          <v-stepper-step step="3"> Confirm payment </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content step="1">
            <v-row>
              <v-col cols="12">
                <v-select outlined label="Address" :items="addresses" />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-mask="['(##) ####-####', '(##) #####-####']"
                  type="tel"
                  outlined
                  label="Phone"
                />
              </v-col>
              <v-col cols="12">
                <v-btn class="primary white--text" @click="step = 2">
                  Confirm <v-icon right>{{ icons.mdiCheckAll }}</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-stepper-content>
          <v-stepper-content step="2">
            <v-row>
              <v-col cols="12">
                <v-data-table :items="products" :headers="headers">
                  <template #item.image="{ item }">
                    <v-img
                      :src="item.primaryImage"
                      :aspect-ratio="21 / 9"
                      :width="250"
                      class="pa-2 ma-1"
                    />
                  </template>
                  <template #item.actions="{ item }">
                    <v-btn icon class="red--text" @click="remove(item.id)">
                      <v-icon>{{ icons.mdiDelete }}</v-icon>
                    </v-btn>
                  </template>
                  <template #item.unitary="{ item }">
                    <span>{{ item.unitary | dinero }}</span>
                  </template>
                  <template #item.price="{ item }">
                    <span>{{ item.price | dinero }}</span>
                  </template>
                </v-data-table>
              </v-col>
              <v-col cols="12">
                <cart-info />
              </v-col>
              <v-col cols="12">
                <v-btn class="primary white--text" @click="step = 1">
                  Back
                </v-btn>
                <v-btn class="primary white--text" @click="step = 3">
                  Confirm <v-icon right>{{ icons.mdiCheckAll }}</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-stepper-content>
          <v-stepper-content step="3">
            <v-row class="py-2">
              <v-col cols="12">
                <v-row>
                  <v-col cols="12">
                    <div id="dropin-container"></div>
                  </v-col>
                  <v-col cols="12">
                    <v-btn
                      v-if="dropInInstance"
                      class="primary white--text"
                      @click="buy"
                    >
                      Buy
                      <v-icon right>{{ icons.mdiCreditCardOutline }}</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-btn class="primary white--text" @click="step = 2">
                  Back
                </v-btn>
              </v-col>
            </v-row>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-col>
  </v-row>
</template>

<script>
import { TheMask } from 'vue-the-mask'
import { mapGetters } from 'vuex'
import { mdiCheckAll, mdiDelete, mdiCreditCardOutline } from '@mdi/js'
import faker from 'faker'
import { Buy } from '../graphql/mutation/buy/Buy'
import cartInfo from '~/components/cartInfo.vue'
import { GetMyPurchases } from '~/graphql/query/purchase/GetMyPurchases'
export default {
  components: { cartInfo },
  directives: { TheMask },
  data() {
    return {
      dropIn: undefined,
      dropInInstance: undefined,
      deviceData: '',
      icons: {
        mdiCheckAll,
        mdiDelete,
        mdiCreditCardOutline,
      },
      addresses: [
        `${faker.address.streetName()} - ${faker.address.city()}, ${faker.address.stateAbbr()} (${faker.address.zipCode()})`,
      ],
      step: 1,
      headers: [
        {
          text: 'Image',
          value: 'image',
          sortable: false,
        },
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'Unitary',
          value: 'unitary',
        },
        {
          text: 'Amount',
          value: 'amount',
        },
        {
          text: 'Price',
          value: 'price',
        },
        {
          text: 'Actions',
          value: 'actions',
        },
      ],
    }
  },
  head: {
    title: 'Payment',
    script: [
      {
        type: 'text/javascript',
        src: 'https://js.braintreegateway.com/web/3.79.1/js/client.min.js',
        async: true,
      },
      {
        type: 'text/javascript',
        src: 'https://js.braintreegateway.com/web/3.79.1/js/data-collector.min.js',
        async: true,
      },
    ],
  },
  computed: mapGetters({
    products: 'products/getCart',
  }),
  watch: {
    step(value) {
      if (value === 3) {
        this.createDropIn()
      }
    },
  },
  mounted() {
    this.dropIn = require('braintree-web-drop-in')
  },
  methods: {
    async createDropIn() {
      const { data } = await this.$axios.get('/gateway/token')
      const amount = this.products
        .reduce((acc, actual) => (acc += actual.amount * actual.price), 0)
        .toFixed(2)
      this.dropInInstance = await this.dropIn.create({
        authorization: data.token,
        container: '#dropin-container',
        paypal: {
          flow: 'checkout',
          amount,
          currency: 'BRL', // TODO
        },
      })
      braintree.client
        .create({
          authorization: data.token,
        })
        .then((clientInstance) => {
          return braintree.dataCollector
            .create({
              client: clientInstance,
            })
            .then((dataCollectorInstance) => {
              this.deviceData = dataCollectorInstance.deviceData
            })
        })
        .catch((err) => {
          this.$toast.error(err)
        })
    },
    async buy() {
      try {
        const method = await this.dropInInstance.requestPaymentMethod()
        this.$apollo
          .mutate({
            mutation: Buy,
            errorPolicy: 'all',
            variables: {
              products: this.products.map((product) => ({
                id: product.id,
                amount: product.amount,
              })),
              nonce: method.nonce,
              deviceData: this.deviceData,
            },
            awaitRefetchQueries: true,
            refetchQueries: [{ query: GetMyPurchases }],
          })
          .then(({ errors }) => {
            if (errors && errors.length) {
              errors.forEach((error) => {
                this.$toast.error(error.message, {
                  duration: 10000,
                })
              })
            } else {
              this.$toast.show('Success', {
                duration: 1000,
              })
              this.$store.commit('products/cleanCart')
              this.$router.push('/profile/purchases')
            }
          })
          .catch((e) => {
            this.$sentry.captureException(e)
          })
      } catch (e) {
        this.$sentry.captureException(e)
      }
    },
    remove(id) {
      this.$store.commit('products/remove', id)
    },
  },
}
</script>

<style></style>
