<template>
  <v-card tile elevation="0">
    <v-card-title> {{ title }} </v-card-title>
    <v-card-text>
      <v-row>
        <v-col v-for="item in value" :key="item.id" cols="12">
          <v-card tile>
            <v-card-text>
              <v-list>
                <v-list-item>
                  <v-list-item-avatar>
                    <v-avatar>
                      <v-img :src="item.user.image" />
                    </v-avatar>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <span class="ml-2">{{ item.user.name }}</span>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      <p v-if="!item.payment.change">
                        Change: It is not necessary
                      </p>
                      <p v-if="item.payment.change">
                        Change:
                        {{ item.payment.change | dinero }}
                      </p>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      Payment type:
                      <v-chip label>
                        <v-icon left>
                          {{
                            item.payment.type === 'MONEY'
                              ? icons.mdiCash
                              : icons.mdiCreditCardMultiple
                          }}
                        </v-icon>
                        {{ item.payment.type }}
                      </v-chip>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    Ordered at: {{ item.createdAt | dateAndHour }}
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    Total: {{ item.totalPrice | dinero }}
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
            <v-card-actions>
              <v-menu>
                <template #activator="{ on }">
                  <v-btn class="primary white--text" v-on="on">
                    Change status
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item v-if="item.status !== 'REQUIRED'">
                    <v-list-item-content>
                      <v-btn text @click="changeStatus(item, 'REQUIRED')">
                        Required
                      </v-btn>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item v-if="item.status !== 'IN_PRODUCTION'">
                    <v-list-item-content>
                      <v-btn text @click="changeStatus(item, 'IN_PRODUCTION')">
                        In production
                      </v-btn>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item v-if="item.status !== 'DELIVERY_PROCESS'">
                    <v-list-item-content>
                      <v-btn
                        text
                        @click="changeStatus(item, 'DELIVERY_PROCESS')"
                      >
                        Delivery process
                      </v-btn>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item v-if="item.status !== 'DELIVERED'">
                    <v-list-item-content>
                      <v-btn text @click="changeStatus(item, 'DELIVERED')">
                        Delivered
                      </v-btn>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mdiCash, mdiCreditCardMultiple } from '@mdi/js'
import { ChangePurchaseStatus } from '../graphql/mutation/purchase/ChangePurchaseStatus'
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    value: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      icons: {
        mdiCash,
        mdiCreditCardMultiple,
      },
    }
  },
  methods: {
    changeStatus(item, status) {
      this.$apollo
        .mutate({
          mutation: ChangePurchaseStatus,
          variables: {
            id: item.id,
            status,
          },
        })
        .then(() => {
          item.status = status
        })
    },
  },
}
</script>

<style></style>
