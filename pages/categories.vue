<template>
  <div>
    <category-overview :payments="getPayments" />
  </div>
</template>

<script>
import CategoryOverview from '~/components/base/CategoryOverview'

export default {
  components: {
    CategoryOverview,
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
