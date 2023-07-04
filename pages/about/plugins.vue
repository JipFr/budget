<template>
  <div class="plugins-page">
    <page-title>Plugins</page-title>

    <p class="secondary">
      Please note that syncing your account will mean your access token will be
      stored in Krab Bij Kas' database.
    </p>

    <plugin-manager />
  </div>
</template>

<style lang="scss" scoped>
.plugins-page {
  margin-bottom: 30vh;
}
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
import PluginManager from '~/components/base/util/PluginManager'

export default {
  components: {
    PageTitle,
    PluginManager,
  },
}
</script>
