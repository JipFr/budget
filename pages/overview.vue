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
    getAllPayments() {
      const user = this.$store.state.user.data
      return user.transactions || []
    },
  },
}
</script>
