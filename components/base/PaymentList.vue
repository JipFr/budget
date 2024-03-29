<template>
  <div class="list">
    <div v-if="payments.length > 0">
      <div v-for="entry in payments" :key="entry[0]" class="date-wrapper">
        <!-- Title -->
        <p class="date-label">{{ toDateString(entry[0]) }}</p>
        <!-- Each payment card -->
        <payment-card
          v-for="payment in entry[1]"
          :key="payment.id"
          :payment="payment"
          :disable-actions="disableActions"
          :show-readd-button="showReaddButton"
          :active="editingPayment === payment.id"
          :minimal="minimal"
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
    disableActions: {
      type: Boolean,
      default: false,
    },
    showReaddButton: {
      type: Boolean,
      default: false,
    },
    reversed: {
      type: Boolean,
      default: true,
    },
    minimal: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      payments: [],
      editingPayment: null,
    }
  },
  watch: {
    rawPayments() {
      this.updatePayments()
    },
  },
  mounted() {
    this.updatePayments()

    this.$nuxt.$on('edit-transaction', (id) => {
      this.editingPayment = id
    })

    this.$nuxt.$on('cancel-transaction-edit', () => {
      this.editingPayment = null
    })
  },
  methods: {
    toDateString(dateString) {
      const [year, month, day] = dateString.split('-')
      const d = new Date(dateString)
      d.setFullYear(year)
      d.setMonth(month - 1)
      d.setDate(day)

      const dayName = days[d.getDay()]
      const date = d.getDate().toString()
      const monthName = months[d.getMonth()].slice(0, 3)

      return `${dayName}, ${monthName} ${date} ${year}`
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
      let payments = Object.entries(dates).sort((a, b) => {
        return new Date(a[0]).getTime() - new Date(b[0]).getTime()
      })
      if (this.reversed) payments = payments.reverse()

      // Sort by creation date inside existing dates
      for (const date of payments) {
        date[1] = date[1].sort((a, b) => {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
        })
      }

      this.payments = payments
    },
  },
}
</script>
