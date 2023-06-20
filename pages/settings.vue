<template>
  <div>
    <!-- Profile -->
    <page-title>Profile</page-title>

    <profile />

    <page-title>Plugins</page-title>

    <p class="secondary">
      Please note that syncing your account will mean your access token will be
      stored in Krab Bij Kas' database.
    </p>

    <plugin-manager />
  </div>
</template>

<style lang="scss" scoped>
.mt {
  margin-top: 70px;
}
.secondary {
  color: var(--text-secondary);
}
</style>

<script>
// Import components
import PageTitle from '~/components/title/PageTitle'
import Profile from '~/components/base/util/Profile'
import PluginManager from '~/components/base/util/PluginManager'

export default {
  components: {
    PageTitle,
    Profile,
    PluginManager,
  },
}
</script>
