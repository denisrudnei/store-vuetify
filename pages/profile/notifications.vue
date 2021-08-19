<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-text>
          <v-list three-line>
            <template v-for="notification in notifications">
              <v-list-item :key="`${notification.id}Item`">
                <v-list-item-content>
                  <v-list-item-title>
                    {{ notification.content }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ notification.date | dateAndHour }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-switch
                    :input-value="notification.read"
                    hide-details
                    :disabled="notification.read"
                    @click="read(notification)"
                  />
                </v-list-item-action>
              </v-list-item>
              <v-divider :key="`${notification.id}Divider`" />
            </template>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { GetAllNotifications } from '../../graphql/query/notification/GetAllNotifications'
import { ReadNotification } from '~/graphql/mutation/notification/ReadNotification'
export default {
  computed: {
    notifications: {
      set(value) {
        this.$store.commit('notification/setAllNotifications', value)
      },
      get() {
        return this.$store.getters['notification/getAllNotifications']
      },
    },
  },
  created() {
    this.$apollo
      .query({
        query: GetAllNotifications,
      })
      .then((response) => {
        this.notifications = response.data.GetAllNotifications
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
          this.$store.commit('notification/readNotification', {
            ...notification,
            read: true,
          })
        })
    },
  },
}
</script>

<style></style>
