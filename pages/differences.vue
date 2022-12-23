<template>
  <div>
    <price-changes
      :all-payments="getAllPayments"
      :visible-count="Infinity"
      expanded
    />
  </div>
</template>

<script>
import PriceChanges from '~/components/base/PriceChanges'

export default {
  components: {
    PriceChanges,
  },
  computed: {
    getAllPayments() {
      const user = this.$store.state.user.data
      return user.transactions || []
    },
  },
}
</script>
