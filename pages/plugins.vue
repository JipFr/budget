<template>
  <div>
    <p>Plugins</p>
    <p>{{ pluginsStateFiltered }}</p>
  </div>
</template>

<script>
import { pluginsState } from '~/krab-plugins/'

export default {
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
