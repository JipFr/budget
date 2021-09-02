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
  },
}
</script>
