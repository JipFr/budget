<script>
import { Scatter } from 'vue-chartjs'
import { state as settingsState } from '~/util/settings'

// Config
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

function toDateString(v) {
  const d = new Date(v)

  const day = days[d.getDay()]
  const date = d.getDate().toString()
  const month = months[d.getMonth()].slice(0, 3)
  const year = d.getFullYear()

  return `${day}, ${month} ${date} ${year}`
}

export default {
  extends: Scatter,
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
            xAxes: [
              {
                ticks: {
                  // Include a dollar sign in the ticks
                  callback: toDateString,
                },
              },
            ],
          },
          animation: {
            duration: 0,
          },
          tooltips: {
            callbacks: {
              label: (tooltipItem, data) => {
                const label =
                  data.datasets[tooltipItem.datasetIndex].label || 'No label'
                return `${label}: ${settingsState.currency.symbol}${
                  tooltipItem.yLabel
                } on ${toDateString(tooltipItem.xLabel)}`
              },
            },
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
