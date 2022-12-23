<template>
  <div>
    <price-changes :all-payments="getAllPayments" />
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
import PriceChanges from '~/components/base/PriceChanges'
import PaymentList from '~/components/base/PaymentList'
import NewTransactionWrapper from '~/components/new-transaction/MainWrapper'

export default {
  components: {
    Portal,
    PriceChanges,
    PaymentList,
    NewTransactionWrapper,
  },
  computed: {
    getAllPayments() {
      const user = this.$store.state.user.data
      return user.transactions || []
    },
    getPayments() {
      const user = this.$store.state.user.data
      return user.transactionsInPeriod || []
    },
  },
}
</script>
