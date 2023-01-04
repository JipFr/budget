<template>
  <div>
    <page-title>Price changes</page-title>
    <price-changes
      :all-payments="getAllPayments"
      :visible-count="Infinity"
      expanded
    />
  </div>
</template>

<script>
import PriceChanges from '~/components/base/PriceChanges'
import PageTitle from '~/components/title/PageTitle'

export default {
  components: {
    PriceChanges,
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
