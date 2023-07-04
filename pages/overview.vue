<template>
  <div class="no-min-height">
    <page-title>Categories overview</page-title>
    <total-overview :payments="getAllPayments" />
  </div>
</template>

<script>
import TotalOverview from '~/components/base/TotalOverview'
import PageTitle from '~/components/title/PageTitle'

export default {
  components: {
    TotalOverview,
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
