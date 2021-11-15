<template>
  <div>
    <prices-overview :payments="getAllPayments" />
  </div>
</template>

<script>
import PricesOverview from '~/components/base/PricesOverview'

export default {
  components: {
    PricesOverview,
  },
  computed: {
    getAllPayments() {
      const user = this.$store.state.user.data
      return user.transactions || []
    },
  },
}
</script>
