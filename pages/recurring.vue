<template>
  <div>
    <page-title>Recurring transactions</page-title>
    <recurring :all-payments="getAllPayments" />
  </div>
</template>

<script>
import Recurring from '~/components/base/Recurring'
import PageTitle from '~/components/title/PageTitle'

export default {
  components: {
    Recurring,
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
