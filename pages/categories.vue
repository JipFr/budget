<template>
  <div>
    <page-title>Category overview</page-title>
    <category-overview :payments="getPayments" />
    <portal to="right-side">
      <div class="new-transaction-content">
        <new-transaction-wrapper :show-button="false" class="no-desktop-bg" />
      </div>
    </portal>
  </div>
</template>

<script>
import { Portal } from 'portal-vue'
import CategoryOverview from '~/components/base/CategoryOverview'
import NewTransactionWrapper from '~/components/new-transaction/MainWrapper'
import PageTitle from '~/components/title/PageTitle'

export default {
  components: {
    CategoryOverview,
    Portal,
    NewTransactionWrapper,
    PageTitle,
  },
  computed: {
    getPayments() {
      const user = this.$store.state.user.data
      return user.transactionsInPeriod || []
    },
  },
}
</script>
