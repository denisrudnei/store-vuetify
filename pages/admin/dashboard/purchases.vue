<template>
  <v-row>
    <v-col cols="12">
      <v-menu :close-on-content-click="false">
        <template #activator="{ on }">
          <v-btn class="primary white--text" v-on="on"> Select date </v-btn>
        </template>
        <v-date-picker v-model="date" type="month" />
      </v-menu>
    </v-col>
    <v-col cols="12">
      <v-card>
        <v-card-text :class="isDark ? 'white--text' : 'black--text'">
          <client-only>
            <apexchart
              ref="chart"
              :options="options"
              :type="options.type"
              :series="series"
              :height="options.height"
              width="100%"
            />
          </client-only>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { getMonth, getYear, format, parse } from 'date-fns'
import { GetPurchaseSummaryInMonth } from '../../../graphql/query/admin/GetPurchaseSummaryInMonth'
export default {
  data() {
    return {
      vue: undefined,
      date: '',
      purchases: [],
      options: {
        type: 'bar',
        stroke: {
          curve: 'smooth',
        },
        xaxis: {
          type: 'datetime',
        },
        height: 200,
        theme: {
          mode: 'light',
          monochrome: {
            enabled: true,
            shadeTo: 'light',
            color: '#000000',
            shadeIntensity: 0.65,
          },
        },
        tooltip: {
          theme: 'light',
        },
      },
      series: [],
    }
  },
  computed: {
    isDark() {
      return this.$vuetify.theme.dark
    },
    year() {
      return getYear(parse(this.date, 'yyyy-MM', new Date()))
    },
    month() {
      return getMonth(parse(this.date, 'yyyy-MM', new Date()))
    },
  },
  watch: {
    '$vuetify.theme.currentTheme.primary': {
      deep: true,
      handler(value) {
        this.updateChartTheme(value)
      },
    },
    date() {
      this.getData()
    },
  },
  async mounted() {
    await this.$nextTick()
    this.updateChartTheme(this.$vuetify.theme.currentTheme.primary)
  },
  created() {
    this.date = format(new Date(), 'yyyy-MM')
    this.getData()
  },
  methods: {
    getData() {
      this.$apollo
        .query({
          query: GetPurchaseSummaryInMonth,
          variables: {
            year: this.year,
            month: this.month,
          },
        })
        .then((response) => {
          this.purchases = []
          this.series = []
          this.purchases = response.data.GetPurchaseSummaryInMonth
          this.series.push({
            data: this.purchases.map((purchase) => ({
              x: purchase.day,
              y: purchase.total,
            })),
          })
        })
    },
    updateChartTheme(color) {
      const mode = this.isDark ? 'dark' : 'light'
      this.options = {
        ...this.options,
        theme: {
          mode,
          monochrome: {
            shadeTo: mode,
            enabled: true,
            color,
            shadeIntensity: 0.65,
          },
        },
        tooltip: {
          theme: mode,
        },
      }
    },
  },
}
</script>

<style></style>
