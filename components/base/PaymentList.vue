<template>
  <div class="list">
    <div v-for="entry in payments" :key="entry[0]" class="date-label">
      <!-- Title -->
      <p class="date-label">{{ toDateString(entry[0]) }}</p>
      <!-- Each payment card -->
      <card v-for="payment in entry[1]" :key="payment.title">
        <div class="card-inner">
          <subtitle>
            <span class="bold">{{ payment.title }}</span>
            <!-- <span class="thin">{{ payment.date }}</span> -->
          </subtitle>
          <money :cents="payment.cents" />
        </div>
      </card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.date-label {
  margin-top: 20px;
  margin-bottom: 5px;
}
.list {
  margin: 10px 0;
}
.bold {
  font-weight: bold;
}
.thin {
  color: var(--text-secondary);
}

.card-inner {
  display: flex;
  justify-content: space-between;
}
.card + .card {
  margin-top: 6px;
}
</style>

<script>
// Import components
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

export default {
  components: {
    Card,
    Subtitle,
    Money,
  },
  data() {
    const rawPayments = [
      {
        cents: 12400,
        title: 'Groceries',
        date: '2020-01-01',
      },
      {
        cents: 250,
        title: 'Bread',
        date: '2020-05-06',
      },
      {
        cents: 15000,
        title: 'AirPods',
        date: '2020-02-05',
      },
      {
        cents: 12400,
        title: 'Groceries',
        date: '2020-01-01',
      },
      {
        cents: 250,
        title: 'Bread',
        date: '2020-05-06',
      },
      {
        cents: 15000,
        title: 'AirPods',
        date: '2020-02-05',
      },
      {
        cents: 12400,
        title: 'Groceries',
        date: '2020-01-01',
      },
      {
        cents: 250,
        title: 'Bread',
        date: '2020-05-06',
      },
      {
        cents: 15000,
        title: 'AirPods',
        date: '2020-02-05',
      },
      {
        cents: 12400,
        title: 'Groceries',
        date: '2020-01-01',
      },
      {
        cents: 250,
        title: 'Bread',
        date: '2020-05-06',
      },
      {
        cents: 15000,
        title: 'AirPods',
        date: '2020-02-05',
      },
      {
        cents: 12400,
        title: 'Groceries',
        date: '2020-01-01',
      },
      {
        cents: 250,
        title: 'Bread',
        date: '2020-05-06',
      },
      {
        cents: 15000,
        title: 'AirPods',
        date: '2020-02-05',
      },
      {
        cents: 12400,
        title: 'Groceries',
        date: '2020-01-01',
      },
      {
        cents: 250,
        title: 'Bread',
        date: '2020-05-06',
      },
      {
        cents: 15000,
        title: 'Laptop',
        date: '2020-02-05',
      },
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Map payments to dates
    const dates = {}
    for (const payment of rawPayments) {
      if (!dates[payment.date]) {
        dates[payment.date] = []
      }
      dates[payment.date].push(payment)
    }

    // Map payments to dates
    const payments = Object.entries(dates).sort((a, b) => {
      return new Date(a[0]).getTime() - new Date(b[0]).getTime()
    })

    return {
      payments,
    }
  },
  methods: {
    toDateString(dateString) {
      const d = new Date(dateString)

      const day = days[d.getDay()]
      const date = d.getDate().toString()
      const month = months[d.getMonth()].slice(0, 3)
      const year = d.getFullYear()

      return `${day}, ${month} ${date} ${year}`
    },
  },
}
</script>
