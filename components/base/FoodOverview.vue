<template>
  <div>
    <p>
      This page shows your predicted usage of the food budget. The green line
      shows the accurate statistics, gray is predicted.
    </p>
    <apexchart
      type="line"
      height="350"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<style lang="scss" scoped>
p {
  color: var(--text-secondary);
  margin-bottom: 40px;
}
</style>

<script>
function thisDateNextMonth(d) {
  const date = new Date(d)

  const expectedMonth = (date.getMonth() + 1) % 12

  let newDate = date
  newDate.setMonth(newDate.getMonth() + 1)
  while (newDate.getMonth() > expectedMonth)
    newDate = new Date(newDate.getTime() - 1e3 * 60 * 60 * 24)

  return newDate
}

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

    const foodTransactions = this.payments
      .filter((payment) => {
        const categories = payment.categories.map((category) =>
          category.toLowerCase()
        )
        return (
          (categories.includes('food') ||
            categories.includes('eten') ||
            categories.includes('eten aanpassen') ||
            categories.includes('adjust food')) &&
          !categories.includes('exclude')
        )
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))

    // --
    const positiveTransactions = foodTransactions.filter((payment) => {
      const categories = payment.categories.map((category) =>
        category.toLowerCase()
      )
      return (
        payment.cents > 0 ||
        categories.includes('adjust food') ||
        categories.includes('eten aanpassen')
      )
    })

    const d = new Date(
      positiveTransactions[positiveTransactions.length - 1].date
    )
    const endDate = d.getDate() >= 23 ? thisDateNextMonth(d) : d
    endDate.setDate(23)

    // --

    const startDate = new Date(positiveTransactions[0].date)

    const foodPredictedTotals = []
    let foodRealTotals = []
    let foodDate = new Date(startDate)

    while (foodDate.getTime() < endDate.getTime()) {
      const periodEndDate =
        foodDate.getDate() >= 23
          ? thisDateNextMonth(foodDate)
          : new Date(foodDate)
      periodEndDate.setDate(23)

      // Find positive transactions on date
      const dateTransactions = positiveTransactions.filter((payment) => {
        const d = new Date(payment.date)
        return (
          d.getFullYear() === foodDate.getFullYear() &&
          d.getMonth() === foodDate.getMonth() &&
          d.getDate() === foodDate.getDate()
        )
      })

      // ! Expected
      let todayPredictedBase =
        foodPredictedTotals[foodPredictedTotals.length - 1]?.cents || 0

      // Add today's transactions
      for (const transaction of dateTransactions) {
        todayPredictedBase += transaction.cents
      }

      // Remove neccesary amount to get to 0 before period's end
      const daysBetween =
        (periodEndDate.getTime() - foodDate.getTime()) / (1e3 * 60 * 60 * 24)
      todayPredictedBase -= todayPredictedBase / daysBetween

      foodPredictedTotals.push({
        cents: todayPredictedBase,
        date: new Date(foodDate),
      })

      foodDate.setDate(foodDate.getDate() + 1)
    }

    // Calculate real totals
    foodDate = new Date(startDate)

    while (foodDate.getTime() < endDate.getTime()) {
      // Find all transactions on date
      const dateTransactions = foodTransactions.filter((payment) => {
        const d = new Date(payment.date)
        return (
          d.getFullYear() === foodDate.getFullYear() &&
          d.getMonth() === foodDate.getMonth() &&
          d.getDate() === foodDate.getDate()
        )
      })

      // ! Expected
      let todayBase = foodRealTotals[foodRealTotals.length - 1]?.cents || 0

      // Add today's transactions
      for (const transaction of dateTransactions) {
        todayBase += transaction.cents
      }

      foodRealTotals.push({
        cents: todayBase,
        date: new Date(foodDate),
      })

      foodDate.setDate(foodDate.getDate() + 1)
    }

    // Remove excesive data from real
    const lastFoodTransaction = foodTransactions[foodTransactions.length - 1]
    foodRealTotals = foodRealTotals.filter(
      (t) =>
        t.date.getTime() <= new Date(lastFoodTransaction.date).getTime() ||
        t.date.getTime() < Date.now()
    )

    // Set to chart
    this.chartOptions.xaxis.categories = foodPredictedTotals.map((v) =>
      toDateString(v.date)
    )

    const expectedUsage = {
      label: 'Expected',
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: 'gray',
      pointRadius: Infinity,
      borderDash: [3, 3],
      data: foodPredictedTotals.map((v) => Math.floor(v.cents) / 100),
    }

    const realUsage = {
      label: 'Remaining',
      backgroundColor: 'transparent',
      borderWidth: 2.5,
      pointRadius: 3,
      hoverPointRadius: 3,
      borderColor: '#457461',
      pointBackgroundColor: '#457461',
      data: foodRealTotals.map((v) => Math.floor(v.cents) / 100),
    }

    this.chartData.datasets = [realUsage, expectedUsage]

    this.series = [
      {
        name: 'Predicted',
        data: foodPredictedTotals.map((v) => Math.floor(v.cents) / 100),
      },
      {
        name: 'Remaining',
        data: foodRealTotals.map((v) => Math.floor(v.cents) / 100),
      },
    ]
  },
  data() {
    return {
      chartData: {
        labels: [],
        datasets: [],
      },
      chartOptions: {
        chart: {
          height: 350,
          type: 'line',
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: 'straight',
        },
        xaxis: {
          categories: [],
        },
        tooltip: {
          shared: true,
        },
        shared: true,
        intersect: false,
      },
      series: [
        {
          name: 'Desktops',
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
        },
      ],
      console,
    }
  },
  watch: {
    payments() {
      this.$fetch()
    },
  },
}
</script>
