<script>
import { Line } from 'vue-chartjs'
import { state as settingsState } from '~/util/settings'

export default {
  extends: Line,
  props: {
    chartdata: {
      type: Object,
      required: true,
    },
    options: {
      type: Object,
      required: false,
      default: () => {
        return {
          legend: {
            display: false,
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  // Include a dollar sign in the ticks
                  callback: (v) => `${settingsState.currency.symbol} ${v}`,
                },
              },
            ],
          },
          animation: {
            duration: 0,
          },
        }
      },
    },
  },
  watch: {
    chartdata() {
      this.$data._chart.update()
      this.render()
    },
  },
  mounted() {
    this.render()
  },
  methods: {
    render() {
      this.renderChart(this.chartdata, this.options)
    },
  },
}
</script>

<style></style>
