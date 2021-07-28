<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-text :class="isDark ? 'white--text' : 'black--text'">
          <no-ssr>
            <apexchart
              ref="chart"
              :options="options"
              :type="options.type"
              :series="series"
              :height="options.height"
              width="100%"
            />
          </no-ssr>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { getMonth, getYear } from 'date-fns'
import { GetPurchaseSummaryInMonth } from '../../../graphql/query/admin/GetPurchaseSummaryInMonth'
export default {
  data() {
    return {
      vue: undefined,
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
  },
  watch: {
    '$vuetify.theme.currentTheme.primary': {
      deep: true,
      handler(value) {
        this.updateChartTheme(value)
      },
    },
  },
  async mounted() {
    await this.$nextTick()
    this.updateChartTheme(this.$vuetify.theme.currentTheme.primary)
  },
  created() {
    this.$apollo
      .query({
        query: GetPurchaseSummaryInMonth,
        variables: {
          year: getYear(new Date()),
          month: getMonth(new Date()),
        },
      })
      .then((response) => {
        this.purchases = response.data.GetPurchaseSummaryInMonth
        this.series.push({
          data: this.purchases.map((purchase) => ({
            x: purchase.day,
            y: purchase.total,
          })),
        })
      })
  },
  methods: {
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
