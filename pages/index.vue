<template>
  <div>
    <payment-list :raw-payments="getPayments" />
    <portal to="right-side">
      <div class="new-transaction-content">
        <new-transaction-wrapper class="no-desktop-bg" />
      </div>
    </portal>
  </div>
</template>

<script>
import { Portal } from 'portal-vue'
import PaymentList from '~/components/base/PaymentList'
import NewTransactionWrapper from '~/components/new-transaction/MainWrapper'

export default {
  components: {
    Portal,
    PaymentList,
    NewTransactionWrapper,
  },
  computed: {
    getPayments() {
      const user = this.$store.state.user.data
      return user.transactionsInPeriod || []
    },
  },
}
</script>
