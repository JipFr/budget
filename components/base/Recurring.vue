<template>
  <div class="list">
    <div v-if="recurringTransactions.length > 0">
      <!-- Each payment card -->
      <payment-card
        v-for="payment of recurringTransactions"
        :key="payment.title"
        :payment="payment"
      />
    </div>
    <div v-else class="empty">No upcoming transactions</div>
  </div>
</template>

<style lang="scss" scoped>
@import '../../assets/scss/paymentlist.scss';
</style>

<script>
// Import components
import PaymentCard from '~/components/base/PaymentCard'

export default {
  components: {
    PaymentCard,
  },
  props: {
    allPayments: {
      type: Array,
      required: true,
    },
  },
  data() {
    let now = new Date()
    now = new Date(
      `${now.getFullYear()}-${(now.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`
    )

    const recurringTransactions = this.allPayments
      .filter((payment) => {
        // Filter by it being in the last "month"
        const paymentDate = new Date(payment.date)
        const diff = now - paymentDate.getTime()
        return diff < 1e3 * 60 * 60 * 24 * 31
      })
      .filter((payment) => {
        // Filter it by being a monthly transaction
        return (
          (payment.categories.includes('maandelijks') ||
            payment.categories.includes('monthly')) &&
          !payment.categories.includes('exclude')
        )
      })
      .map((payment) => {
        // Map it into a usable format
        const date = new Date(payment.date)
        const expectedMonth = date.getMonth() + 1
        let newDate = new Date(
          `${date.getFullYear()}-${(date.getMonth() + 2)
            .toString()
            .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
        )

        while (newDate.getMonth() > expectedMonth) {
          newDate = new Date(newDate.getTime() - 1e3 * 60 * 60 * 24)
        }

        const diff = newDate.getTime() - now.getTime()
        const inXDays = Math.round(diff / (1e3 * 60 * 60 * 24))

        return {
          ...payment,
          inXDays,
        }
      })
      .sort((paymentA, paymentB) => {
        // Sort payments by amount of days left
        return paymentA.inXDays - paymentB.inXDays
      })
    return {
      recurringTransactions,
    }
  },
}
</script>
