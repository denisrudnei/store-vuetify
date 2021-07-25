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
                <v-text-field outlined label="Name" />
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
                  <template #item.image>
                    <v-img
                      :src="`https://picsum.photos/800/600/?${Math.random()}`"
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
                    <span>{{ item.unitary | price }}</span>
                  </template>
                  <template #item.price="{ item }">
                    <span>{{ item.price | price }}</span>
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
                <v-text-field
                  v-mask="'#### #### #### ####'"
                  outlined
                  type="tel"
                  label="Card number"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-mask="'##/##'"
                  outlined
                  label="Exp date"
                  type="tel"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-mask="'###'"
                  outlined
                  type="tel"
                  label="Card code"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-btn class="primary white--text" @click="step = 2">
                  Back
                </v-btn>
                <v-btn class="primary white--text" @click="buy">
                  Buy <v-icon right>{{ icons.mdiCreditCardOutline }}</v-icon>
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
import { Buy } from '../graphql/mutation/buy/Buy'
import cartInfo from '~/components/cartInfo.vue'
export default {
  auth: false,
  components: { cartInfo },
  directives: { TheMask },
  filters: {
    price(value) {
      return `$ ${value}`
    },
  },
  data() {
    return {
      icons: {
        mdiCheckAll,
        mdiDelete,
        mdiCreditCardOutline,
      },
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
  },
  computed: mapGetters({
    products: 'products/getCart',
  }),
  methods: {
    buy() {
      this.$apollo
        .mutate({
          mutation: Buy,
          variables: {
            products: this.products.map((product) => ({
              id: product.id,
              amount: product.amount,
            })),
          },
        })
        .then(() => {
          this.$toast.show('sucess')
        })
    },
  },
}
</script>

<style></style>
