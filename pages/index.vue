<template>
  <div>
    <page-title>Transactions</page-title>
    <push-notif-button />

    <!-- TODO RE-ADD PLUGIN ERRORS-->

    <price-changes :all-payments="getAllPayments" />
    <payment-list :raw-payments="getPayments" />
    <portal to="right-side">
      <div class="new-transaction-content">
        <new-transaction-wrapper class="no-desktop-bg" />
      </div>
    </portal>
  </div>
</template>

<style lang="scss" scoped>
.plaid-view {
  margin-bottom: 70px;
}
@media (max-width: 700px) {
  .price-changes {
    display: none;
  }
  .plaid-view {
    margin-bottom: 40px;
  }
}
</style>

<script>
import { Portal } from 'portal-vue'
import PushNotifButton from '~/components/base/util/PushNotifButton'
import PriceChanges from '~/components/base/PriceChanges'
import PaymentList from '~/components/base/PaymentList'
import NewTransactionWrapper from '~/components/new-transaction/MainWrapper'
import PageTitle from '~/components/title/PageTitle'

export default {
  components: {
    Portal,
    PriceChanges,
    PaymentList,
    NewTransactionWrapper,
    PageTitle,
    PushNotifButton,
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
