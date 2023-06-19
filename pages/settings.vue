<template>
  <div>
    <!-- Profile -->
    <page-title>Profile</page-title>

    <profile />

    <!-- Bank stuff-->
    <page-title>Bank accounts</page-title>

    <plaid-view />

    <div class="mt">
      <page-title>Albert Heijn</page-title>
      <ah-view />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mt {
  margin-top: 70px;
}
</style>

<script>
// Import components
import PageTitle from '~/components/title/PageTitle'
import Profile from '~/components/base/util/Profile'
import PlaidView from '~/components/base/util/PlaidView'
import AhView from '~/components/base/util/AhView'

export default {
  components: {
    PageTitle,
    Profile,
    PlaidView,
    AhView,
  },
}
</script>
