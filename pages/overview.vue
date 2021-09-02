<template>
  <div>
    <total-overview :payments="getAllPayments" />
  </div>
</template>

<script>
import TotalOverview from '~/components/base/TotalOverview'

export default {
  components: {
    TotalOverview,
  },

  computed: {
    getPayments() {
      const user = this.$store.state.user.data
      return user.transactionsInPeriod || []
    },
    getAllPayments() {
      const user = this.$store.state.user.data
      return user.transactions || []
    },
    isLoading() {
      return this.$store.state.user.data.loading
    },
    getQuery() {
      return Object.keys(this.$route.query).join('')
    },
  },
}
</script>
