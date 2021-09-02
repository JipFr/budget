<template>
  <div>
    <recurring :all-payments="getAllPayments" />
  </div>
</template>

<script>
import Recurring from '~/components/base/Recurring'

export default {
  components: {
    Recurring,
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
