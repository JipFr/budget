<template>
  <div>
    <!-- Profile -->
    <page-title>Profile</page-title>

    <profile />

    <!-- Bank stuff-->
    <page-title>Bank accounts</page-title>

    <plaid-view />
  </div>
</template>

<script>
// Import components
import PageTitle from '~/components/title/PageTitle'
import Profile from '~/components/base/util/Profile'
import PlaidView from '~/components/base/util/PlaidView'

export default {
  components: {
    PageTitle,
    Profile,
    PlaidView,
  },
}
</script>
