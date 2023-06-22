<template>
  <div class="profile-page">
    <!-- Profile -->
    <page-title>Profile</page-title>

    <profile />
  </div>
</template>

<script>
// Import components
import PageTitle from '~/components/title/PageTitle'
import Profile from '~/components/base/util/Profile'

export default {
  components: {
    PageTitle,
    Profile,
  },
}
</script>
