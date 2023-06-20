<template>
  <div>
    <p>Plugins</p>
    <p>{{ pluginsStateFiltered }}</p>
    <hr />
    <plugin-manager />
  </div>
</template>

<script>
// Import components
import PluginManager from '~/components/base/util/PluginManager'

// Import plugin state
import { pluginsState } from '~/krab-plugins/'

export default {
  components: {
    PluginManager,
  },
  data() {
    return {
      pluginsState,
    }
  },
  computed: {
    pluginsStateFiltered() {
      const t = Object.assign({}, pluginsState)
      t.transactions = undefined
      return t
    },
  },
}
</script>
