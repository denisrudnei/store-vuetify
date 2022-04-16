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
                <v-select
                  v-model="address"
                  outlined
                  label="Address"
                  :items="addresses"
                />
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  v-model="phone"
                  :items="phones"
                  outlined
                  label="Phone"
                />
              </v-col>
              <v-col cols="12">
                <v-card tile elevation="0">
                  <v-card-title> Purchase type </v-card-title>
                  <v-card-text>
                    <v-checkbox
                      v-model="purchaseType"
                      value="NORMAL"
                      label="Normal"
                    />
                    <v-checkbox
                      v-model="purchaseType"
                      value="DELIVERY"
                      label="Delivery"
                    />
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12">
                <v-btn
                  class="primary white--text"
                  :disabled="noInformation"
                  @click="step = 2"
                >
                  Confirm
                  <v-icon right>{{ icons.mdiCheckAll }}</v-icon>
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
                  <v-col v-if="purchaseType === 'DELIVERY'" cols="12">
                    <v-card tile elevation="0">
                      <v-card-title> Pay on delivery </v-card-title>
                      <v-card-text>
                        <v-row>
                          <v-col>
                            <v-checkbox
                              v-model="payOnDelivery"
                              label="Card"
                              value="CARD"
                            />
                            <v-checkbox
                              v-model="payOnDelivery"
                              label="Debit card"
                              value="DEBIT_CARD"
                            />
                            <v-checkbox
                              v-model="payOnDelivery"
                              label="Credit card"
                              value="CREDIT_CARD"
                            />
                            <v-checkbox
                              v-model="payOnDelivery"
                              label="Money"
                              value="MONEY"
                            />
                          </v-col>
                          <v-divider
                            v-if="payOnDelivery === 'MONEY'"
                            vertical
                          />
                          <v-col v-if="payOnDelivery === 'MONEY'">
                            <v-row>
                              <v-col cols="12">
                                <v-text-field
                                  v-model="money"
                                  v-mask="'#######'"
                                  type="tel"
                                  label="Value"
                                  outlined
                                />
                              </v-col>
                              <v-col cols="12">
                                <h2 class="text-center text-h2">
                                  Total: {{ total | dinero }}
                                </h2>
                              </v-col>
                              <v-col cols="12">
                                <h3 class="text-center text-h3">
                                  Change: {{ change | dinero }}
                                </h3>
                              </v-col>
                              <v-col cols="12">
                                <v-btn
                                  class="primary white--text"
                                  block
                                  @click="noNeedChange"
                                >
                                  Don't need change
                                  <v-icon right>
                                    {{ icons.mdiCashMultiple }}
                                  </v-icon>
                                </v-btn>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-divider />
                  <v-col v-show="!payOnDelivery" cols="12">
                    <v-card tile elevation="0">
                      <v-card-title> Pay now </v-card-title>
                      <v-card-text>
                        <div id="dropin-container"></div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12">
                    <v-btn
                      v-if="dropInInstance"
                      class="primary white--text"
                      :disabled="buyDisabled"
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
// eslint-disable-next-line import/named
// eslint-disable-next-line import/named
import { TheMask } from 'vue-the-mask'
import { mapGetters } from 'vuex'
import {
  mdiCheckAll,
  mdiDelete,
  mdiCreditCardOutline,
  mdiCashMultiple,
} from '@mdi/js'
import { Buy } from '../graphql/mutation/buy/Buy'
import cartInfo from '~/components/cart-info.vue'
import { GetMyPurchases } from '~/graphql/query/purchase/GetMyPurchases'
import { GetActualUser } from '~/graphql/query/user/GetActualUser'
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
        mdiCashMultiple,
      },
      user: {
        addresses: [],
        phones: [],
      },
      address: undefined,
      phone: undefined,
      purchaseType: 'NORMAL',
      payOnDelivery: undefined,
      money: 0,
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
  computed: {
    addresses() {
      return this.user.addresses.map((address) => ({
        text: address.fullName,
        value: address,
      }))
    },
    phones() {
      return this.user.phones.map((phone) => ({
        text: `${phone.description} - ${phone.number}`,
        value: phone,
      }))
    },
    noInformation() {
      return !this.address || !this.purchaseType || !this.phone
    },
    total() {
      return this.products.reduce(
        (previous, item) => previous + parseFloat(item.price),
        0
      )
    },
    change() {
      const result = this.money - this.total
      return isNaN(result) ? -this.total : result
    },
    buyDisabled() {
      if (this.purchaseType === 'DELIVERY' && this.payOnDelivery === 'MONEY') {
        return this.money < this.total
      }
      return false
    },
    ...mapGetters({
      products: 'products/getCart',
    }),
  },
  watch: {
    step(value) {
      if (value === 3) {
        this.createDropIn()
      }
    },
  },
  created() {
    this.$apollo
      .query({
        query: GetActualUser,
      })
      .then((response) => {
        this.user = response.data.GetActualUser
        if (this.user.phones.length === 1) {
          this.phone = this.user.phones[0]
        }
        if (this.user.addresses.length === 1) {
          this.address = this.user.addresses[0]
        }
      })
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
          currency: this.$store.getters['site-settings/getCurrency'],
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
      let method = {}
      try {
        if (!this.payOnDelivery) {
          method = await this.dropInInstance.requestPaymentMethod()
        }
        this.$apollo
          .mutate({
            mutation: Buy,
            errorPolicy: 'all',
            variables: {
              type: this.purchaseType,
              payment: this.payOnDelivery
                ? {
                    type: this.payOnDelivery,
                    value: this.total,
                    paid: this.money ? parseFloat(this.money) : this.total,
                  }
                : {
                    type: 'CARD',
                    value: this.total,
                    paid: this.total,
                  },
              products: this.products.map((product) => ({
                id: product.id,
                amount: product.amount,
              })),
              nonce: method.nonce ? method.nonce : '',
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
    noNeedChange() {
      this.money = this.total
    },
    remove(id) {
      this.$store.commit('products/remove', id)
    },
  },
}
</script>

<style></style>
