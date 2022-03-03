<template>
  <div>
    <food-overview :payments="getPayments" />
  </div>
</template>

<script>
import FoodOverview from '~/components/base/FoodOverview'

export default {
  components: {
    FoodOverview,
  },
  computed: {
    getPayments() {
      const user = this.$store.state.user.data
      return user.transactionsInPeriod || []
    },
  },
}
</script>
