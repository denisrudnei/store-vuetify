<template>
  <v-menu
    v-model="menu"
    :max-height="isMobile ? '90vh' : 450"
    :max-width="isMobile ? '95vw' : 800"
    :nudge-width="isMobile ? '95vw' : 450"
    offset-y
    left
    :close-on-content-click="false"
  >
    <template #activator="{ on }">
      <v-btn
        icon
        :class="{
          'white--text': $vuetify.theme.dark,
          'primary--text': !$vuetify.theme.dark,
        }"
        v-on="on"
      >
        <v-badge bottom overlap left bordered color="accent">
          <v-icon>
            {{ notifications.length ? icons.mdiBellRing : icons.mdiBell }}
          </v-icon>
          <template #badge>
            {{ notifications.length }}
          </template>
        </v-badge>
      </v-btn>
    </template>
    <v-card>
      <v-sheet class="fixed-title">
        <v-card-title>Notifications</v-card-title>
        <v-divider />
      </v-sheet>
      <v-card-text v-if="notifications.length">
        <v-list three-line>
          <template v-for="notification in notifications">
            <v-list-item :key="`list${notification.id}`">
              <v-list-item-content>
                <v-list-item-title>
                  {{ notification.content }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ notification.date | dateAndHour }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-menu nudge-width="350" :close-on-content-click="false">
                  <template #activator="{ on }">
                    <v-btn icon v-on="on">
                      <v-icon>{{ icons.mdiPlus }}</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item @click="read(notification)">
                      <v-list-item-icon>
                        <v-icon>{{ icons.mdiCheck }}</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content> Read </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-list-item-action>
            </v-list-item>
            <v-divider :key="`divider${notification.id}`" />
          </template>
        </v-list>
      </v-card-text>
    </v-card>
    <v-divider />
    <v-card class="fixed-buttons">
      <v-card-text>
        <v-row>
          <v-col v-if="!notifications.length" cols="12">
            <v-alert
              color="warning"
              outlined
              prominent
              :icon="icons.mdiBellOff"
            >
              No notification
            </v-alert>
          </v-col>
          <v-col v-if="notifications.length" cols="12">
            <v-btn block class="primary white--text" @click="readAll">
              Read all
              <v-icon right>{{ icons.mdiCheckAll }}</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn
              class="primary white--text"
              block
              to="/profile/notifications"
            >
              View all
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              v-if="$vuetify.breakpoint.mobile"
              block
              class="primary white--text"
              @click="menu = false"
            >
              Close
              <v-icon right> {{ icons.mdiClose }} </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
import {
  mdiBell,
  mdiBellRing,
  mdiClose,
  mdiCheckAll,
  mdiCheck,
  mdiPlus,
  mdiBellOff,
} from '@mdi/js'
import { GetNotifications } from '../graphql/query/notification/GetNotifications'
import { NewNotification } from '../graphql/subscription/notification/NewNotification'
import { ReadNotification } from '../graphql/mutation/notification/ReadNotification'
import { ReadAllNotifications } from '../graphql/mutation/notification/ReadAllNotifications'
import theme from '~/mixins/theme'
export default {
  mixins: [theme],
  data() {
    return {
      icons: {
        mdiBell,
        mdiBellRing,
        mdiClose,
        mdiCheckAll,
        mdiCheck,
        mdiPlus,
        mdiBellOff,
      },
      menu: false,
    }
  },
  computed: {
    notifications: {
      set(value) {
        this.$store.commit('notification/setNotifications', value)
      },
      get() {
        return this.$store.getters['notification/getNotifications']
      },
    },
  },
  created() {
    const vue = this
    this.$apollo
      .query({
        query: GetNotifications,
      })
      .then((response) => {
        this.notifications = response.data.GetNotifications
      })
    const notificationSubscription = this.$apollo.subscribe({
      query: NewNotification,
    })

    notificationSubscription.subscribe({
      next({ data }) {
        navigator.vibrate([500, 250, 500])
        vue.$store.commit('notification/addNotification', data.NewNotification)
      },
    })
  },
  methods: {
    read(notification) {
      this.$apollo
        .mutate({
          mutation: ReadNotification,
          variables: {
            id: notification.id,
          },
        })
        .then(() => {
          this.$store.commit('notification/readNotification', notification)
        })
    },
    readAll() {
      this.$apollo
        .mutate({
          mutation: ReadAllNotifications,
        })
        .then(() => {
          this.$store.commit('notification/setNotifications', [])
        })
    },
  },
}
</script>

<style scoped>
.fixed-title {
  top: 0 !important;
  margin-bottom: auto !important;
  position: sticky !important;
  z-index: 999 !important;
}
.fixed-buttons {
  bottom: 0 !important;
  margin-top: auto !important;
  position: sticky !important;
}
</style>
