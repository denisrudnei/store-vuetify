<template>
  <v-card>
    <v-card-title>Social networks to show </v-card-title>
    <v-card-text>
      <v-row align="center" justify="center">
        <v-col cols="12" md="6">
          <v-text-field
            v-model="socialNetworks.facebook"
            label="Facebook"
            :append-icon="icons.mdiFacebook"
            outlined
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="socialNetworks.youtube"
            label="Youtube"
            :append-icon="icons.mdiYoutube"
            outlined
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="socialNetworks.twitter"
            label="Twitter"
            :append-icon="icons.mdiTwitter"
            outlined
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="socialNetworks.discord"
            label="Discord"
            :append-icon="icons.mdiDiscord"
            outlined
          />
        </v-col>
        <v-col cols="12">
          <v-btn class="primary white--text" @click="save">
            Save
            <v-icon right>{{ icons.mdiCheckAll }}</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import {
  mdiFacebook,
  mdiYoutube,
  mdiTwitter,
  mdiDiscord,
  mdiCheckAll,
} from '@mdi/js'
import { GetSocialNetworks } from '../../graphql/query/social-networks/GetSocialNetworks'
import { EditSocialNetworks } from '../../graphql/mutation/social-networks/EditSocialNetworkds'
export default {
  data() {
    return {
      icons: {
        mdiFacebook,
        mdiYoutube,
        mdiTwitter,
        mdiDiscord,
        mdiCheckAll,
      },
      socialNetworks: {
        facebook: '',
        youtube: '',
        twitter: '',
        discord: '',
      },
    }
  },
  head: {
    title: 'Social Networks',
  },
  created() {
    this.$apollo
      .query({
        query: GetSocialNetworks,
      })
      .then((response) => {
        this.socialNetworks = response.data.GetSocialNetworks
      })
  },
  methods: {
    save() {
      this.$apollo
        .mutate({
          mutation: EditSocialNetworks,
          variables: {
            socialNetworks: {
              facebook: this.socialNetworks.facebook,
              youtube: this.socialNetworks.youtube,
              twitter: this.socialNetworks.twitter,
              discord: this.socialNetworks.discord,
            },
          },
        })
        .then(() => {
          this.$toast.show('Updated', {
            duration: 1000,
          })
        })
        .catch(() => {
          this.$toast.error('Failed do update', {
            duration: 10000,
          })
        })
    },
  },
}
</script>

<style></style>
