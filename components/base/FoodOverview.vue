<template>
  <div>
    <div class="two-cols">
      <card>
        <subtitle>Today's budget</subtitle>
        <h2>
          <money :cents="foodToday" />
        </h2>
      </card>
      <card>
        <subtitle>Total budget</subtitle>
        <h2>
          <money :cents="totalFood" />
        </h2>
      </card>
      <card>
        <subtitle>Remaining total</subtitle>
        <h2>
          <money :cents="remainingBudget" />
        </h2>
      </card>
    </div>
    <p>
      This page shows your predicted usage of the food budget. The green line
      shows the accurate statistics, gray is predicted.
    </p>
    <chart
      :chartdata="chartData"
      :options="{
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
        tooltips: {
          mode: 'index',
          intersect: false,
          callbacks: {
            afterBody: (ctx) => {
              if (ctx.length > 1) {
                const cents = (ctx[0].yLabel - ctx[1].yLabel) * 100
                return `\nTotal: ${Math.floor(cents) / 100}`
              }
              return ''
            },
          },
        },
        plugins: {
          tooltip: {},
        },
      }"
    />
  </div>
</template>

<style lang="scss" scoped>
p {
  color: var(--text-secondary);
  margin-bottom: 40px;
}
h2 {
  font-size: 1.5rem;
  margin-top: 10px;
}
.two-cols {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  margin-bottom: 20px;
}

@media (max-width: 700px) {
  .two-cols {
    grid-template-columns: 100%;
    grid-gap: 10px;
  }
}
</style>

<script>
/* eslint-disable no-unused-vars */
import { getFoodInfo } from '~/util/food'
import Chart from '~/components/base/util/Chart'
import Card from '~/components/layout/Card'
import Subtitle from '~/components/title/Subtitle'
import Money from '~/components/title/Money'

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
  components: {
    Chart,
    Card,
    Subtitle,
    Money,
  },
  props: {
    payments: {
      type: Array,
      required: true,
    },
  },
  fetch() {
    this.chartData = {
      labels: [],
      datasets: [],
    }

    const {
      predictedTotals,
      realTotals,
      availableMoneyToday,
      totalBudget,
      remainingBudget,
    } = getFoodInfo(this.payments)

    // Set "money today"
    this.foodToday = availableMoneyToday
    this.totalFood = totalBudget
    this.remainingBudget = remainingBudget

    // Set to chart
    this.chartData.labels = predictedTotals.map((v) => toDateString(v.date))

    const expectedUsage = {
      label: 'Expected',
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: 'gray',
      pointRadius: Infinity,
      borderDash: [3, 3],
      data: predictedTotals.map((v) => Math.floor(v.cents) / 100),
    }

    const realUsage = {
      label: 'Remaining',
      backgroundColor: 'transparent',
      borderWidth: 2.5,
      pointRadius: 3,
      hoverPointRadius: 3,
      borderColor: '#457461',
      pointBackgroundColor: '#457461',
      data: realTotals.map((v) => Math.floor(v.cents) / 100),
    }

    this.chartData.datasets = [realUsage, expectedUsage]
  },
  fetchOnServer: false,
  data() {
    return {
      chartData: {
        labels: [],
        datasets: [],
      },
      foodToday: 0,
      totalFood: 0,
      remainingBudget: 0,
    }
  },
  watch: {
    payments() {
      this.$fetch()
    },
  },
}
</script>
