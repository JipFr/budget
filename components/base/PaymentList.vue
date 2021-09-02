<template>
  <div class="list">
    <div v-if="payments.length > 0">
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
    <div v-else class="empty">This period has no transactions</div>
  </div>
</template>

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
  props: {
    rawPayments: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      payments: [],
    }
  },
  watch: {
    rawPayments() {
      this.updatePayments()
    },
  },
  mounted() {
    this.updatePayments()
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
    updatePayments() {
      // Map payments to dates
      const dates = {}
      for (const payment of this.rawPayments || []) {
        if (!dates[payment.date]) {
          dates[payment.date] = []
        }
        dates[payment.date].unshift(payment)
      }

      // Map payments to dates
      const payments = Object.entries(dates).sort((a, b) => {
        return new Date(b[0]).getTime() - new Date(a[0]).getTime()
      })

      this.payments = payments
    },
  },
}
</script>
