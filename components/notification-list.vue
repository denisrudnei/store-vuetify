<template>
  <v-menu
    v-model="menu"
    :max-height="$vuetify.breakpoint.mobile ? '90vh' : 450"
    nudge-width="450"
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
        <v-icon>{{ icons.mdiBell }}</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-sheet class="fixed-title">
        <v-card-title>Notifications</v-card-title>
        <v-divider />
      </v-sheet>
      <v-card-text>
        <v-list>
          <template v-for="notification in notifications">
            <v-list-item :key="`list${notification.id}`">
              <v-list-item-content>
                <v-list-item-title>
                  {{ notification.text }}
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon>
                  <v-icon>{{ icons.mdiPlus }}</v-icon>
                </v-btn>
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
          <v-col cols="12">
            <v-btn block class="primary white--text">
              Read all
              <v-icon right>{{ icons.mdiCheckAll }}</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn class="primary white--text" block> View all</v-btn>
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
import faker from 'faker'
import { mdiBell, mdiClose, mdiCheckAll, mdiPlus } from '@mdi/js'
export default {
  data() {
    return {
      icons: {
        mdiBell,
        mdiClose,
        mdiCheckAll,
        mdiPlus,
      },
      menu: false,
      notifications: Array.from({ length: 15 }, (_, i) => (i += 1)).map(
        (item) => ({
          id: item,
          text: faker.lorem.sentence(),
        })
      ),
    }
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
