<template>
  <v-row align="center" justify="center" class="pr-3">
    <v-col cols="12" xl="4">
      <h2 class="display-4 text-center">0</h2>
      <v-rating
        length="5"
        :value="4.5"
        half-increments
        readonly
        :small="!isMobile"
        class="text-center"
      />
      <p class="text-center">Total: 0 }}</p>
    </v-col>
    <v-col cols="12" xl="8">
      <v-row dense>
        <v-col cols="1"> 5</v-col>
        <v-col cols="11">
          <v-progress-linear
            height="10"
            rounded
            value="95"
            class="my-1"
            :dark="!isDark"
          />
        </v-col>
        <v-col cols="1">4</v-col>
        <v-col cols="11">
          <v-progress-linear
            height="10"
            rounded
            value="5"
            class="my-1"
            :dark="!isDark"
          />
        </v-col>
        <v-col cols="1">3</v-col>
        <v-col cols="11">
          <v-progress-linear
            height="10"
            rounded
            value="0"
            class="my-1"
            :dark="!isDark"
          />
        </v-col>
        <v-col cols="1">2</v-col>
        <v-col cols="11">
          <v-progress-linear
            height="10"
            rounded
            value="0"
            class="my-1"
            :dark="!isDark"
          />
        </v-col>
        <v-col cols="1">1</v-col>
        <v-col cols="11">
          <v-progress-linear
            height="10"
            rounded
            value="0"
            class="my-1"
            :dark="!isDark"
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import theme from '~/mixins/theme'
export default {
  mixins: [theme],
}
</script>

<style></style>
