<template>
  <div class="list">
    <div v-if="recurringTransactions.length > 0">
      <payment-list
        :raw-payments="recurringTransactions"
        disable-actions
        show-readd-button
        :reversed="false"
      />
    </div>
    <div v-else class="empty">No upcoming transactions</div>
  </div>
</template>

<script>
// Import components
import PaymentList from '~/components/base/PaymentList'
import { recurringTransactions } from '~/util/recurring'

export default {
  components: {
    PaymentList,
  },
  props: {
    allPayments: {
      type: Array,
      required: true,
    },
  },
  computed: {
    recurringTransactions() {
      return recurringTransactions(this.allPayments)
    },
  },
}
</script>
