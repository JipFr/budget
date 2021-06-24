<script>
import { Line } from 'vue-chartjs'

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
                  callback: (v) => `€ ${v}`,
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
  mounted() {
    this.render()
  },
  watch: {
    chartdata() {
      console.log('refreshed')
      this.$data._chart.update()
      this.render()
    },
  },
  methods: {
    render() {
      this.renderChart(this.chartdata, this.options)
    },
  },
}
</script>

<style></style>
