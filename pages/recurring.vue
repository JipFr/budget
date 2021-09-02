<template>
  <div>
    <recurring :all-payments="getAllPayments" />
  </div>
</template>

<script>
import Recurring from '~/components/base/Recurring'

export default {
  components: {
    Recurring,
  },

  computed: {
    getAllPayments() {
      const user = this.$store.state.user.data
      return user.transactions || []
    },
  },
}
</script>
