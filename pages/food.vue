<template>
  <div>
    <page-title>Food budget</page-title>
    <food-overview :payments="getPayments" />
  </div>
</template>

<script>
import FoodOverview from '~/components/base/FoodOverview'
import PageTitle from '~/components/title/PageTitle'

export default {
  components: {
    FoodOverview,
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
