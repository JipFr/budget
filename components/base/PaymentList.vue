<template>
  <div class="list">
    <div v-for="entry in payments" :key="entry[0]" class="date-wrapper">
      <!-- Title -->
      <p class="date-label">{{ toDateString(entry[0]) }}</p>
      <!-- Each payment card -->
      <payment-card
        v-for="payment in entry[1]"
        :key="payment.title"
        :payment="payment"
      />
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
.card + .card {
  margin-top: 6px;
}
</style>

<script>
// Import components
import PaymentCard from '~/components/base/PaymentCard'

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
    PaymentCard,
  },
  data() {
    const rawPayments = [
      {
        cents: 12400,
        title: 'Groceries',
        date: '2020-01-01',
        tags: ['groceries'],
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
        cents: 10000,
        title: 'Spotify',
        date: '2020-05-06',
        tags: ['Entertainment', 'Music'],
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
        cents: 60000,
        title: 'Rent',
        date: '2020-05-06',
        tags: ['Monthly'],
      },
      {
        cents: 15000,
        title: 'AirPods',
        date: '2020-02-05',
        tags: ['Entertainment'],
      },
      {
        cents: 60000,
        title: 'Huur',
        date: '2020-01-01',
      },
      {
        cents: 500,
        title: 'Monthly DigitalOcean',
        date: '2020-05-06',
        tags: ['Monthly', 'Dev'],
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
        tags: ['Groceries', 'Food'],
      },
      {
        cents: 15000,
        title: 'Laptop',
        date: '2020-02-05',
      },
    ]

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
      return new Date(b[0]).getTime() - new Date(a[0]).getTime()
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
