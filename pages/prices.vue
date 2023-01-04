<template>
  <div class="no-min-height">
    <page-title>Prices</page-title>
    <prices-overview :payments="getAllPayments" />
  </div>
</template>

<script>
import PricesOverview from '~/components/base/PricesOverview'
import PageTitle from '~/components/title/PageTitle'

export default {
  components: {
    PricesOverview,
    PageTitle,
  },
  computed: {
    getAllPayments() {
      const user = this.$store.state.user.data
      return user.transactions || []
    },
  },
}
</script>
